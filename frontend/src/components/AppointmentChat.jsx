import { useEffect, useMemo, useRef, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const doctorTemplates = [
    'Please continue the current treatment and update me if symptoms change.',
    'Your report has been reviewed. Please book a follow-up appointment in 7 days.',
    'Take the medication as prescribed and contact the clinic if side effects appear.',
];

const faqReplies = [
    {
        trigger: ['hours', 'open', 'closed'],
        answer: 'The clinic team can answer scheduling questions through notifications or your next appointment request.',
    },
    {
        trigger: ['report', 'file', 'attachment'],
        answer: 'Doctors can attach reports, prescriptions, and follow-up advice directly in this chat.',
    },
    {
        trigger: ['emergency', 'urgent', 'breathing', 'chest'],
        answer: 'For urgent or severe symptoms, contact emergency services immediately instead of waiting for a chat reply.',
    },
];

export default function AppointmentChat({ title = 'Care messages' }) {
    const { user } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [attachment, setAttachment] = useState(null);
    const [loadingConversations, setLoadingConversations] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');
    const [helperQuestion, setHelperQuestion] = useState('');
    const fileInputRef = useRef(null);
    const bottomRef = useRef(null);

    const selectedConversation = conversations.find((item) => item.id === selectedId);

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        const refreshWhenVisible = () => {
            if (document.visibilityState === 'visible') {
                fetchConversations();
            }
        };

        window.addEventListener('focus', fetchConversations);
        document.addEventListener('visibilitychange', refreshWhenVisible);

        return () => {
            window.removeEventListener('focus', fetchConversations);
            document.removeEventListener('visibilitychange', refreshWhenVisible);
        };
    }, []);

    useEffect(() => {
        if (selectedId) {
            fetchMessages(selectedId);
        }
    }, [selectedId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, [messages]);

    const fetchConversations = async () => {
        setLoadingConversations(true);
        try {
            const res = await api.get('/chat/conversations');
            setConversations(res.data || []);
            setSelectedId((current) => current || res.data?.[0]?.id || null);
        } catch {
            setError('Unable to load care conversations.');
        } finally {
            setLoadingConversations(false);
        }
    };

    const fetchMessages = async (appointmentId) => {
        setLoadingMessages(true);
        try {
            const res = await api.get(`/chat/appointments/${appointmentId}/messages`);
            setMessages(res.data || []);
            setConversations((prev) =>
                prev.map((item) => (item.id === appointmentId ? { ...item, unread_count: 0 } : item))
            );
        } catch {
            setError('Unable to load messages for this appointment.');
        } finally {
            setLoadingMessages(false);
        }
    };

    const sendMessage = async (event) => {
        event.preventDefault();
        if (!selectedId || (!message.trim() && !attachment)) return;

        setSending(true);
        setError('');
        const formData = new FormData();
        if (message.trim()) formData.append('message', message.trim());
        if (attachment) formData.append('attachment', attachment);

        try {
            const res = await api.post(`/chat/appointments/${selectedId}/messages`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setMessages((prev) => [...prev, res.data]);
            setMessage('');
            setAttachment(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
            await fetchConversations();
        } catch (err) {
            setError(err.response?.data?.message || 'Message could not be sent.');
        } finally {
            setSending(false);
        }
    };

    const helperAnswer = useMemo(() => {
        const question = helperQuestion.toLowerCase();
        if (!question.trim()) return '';
        const match = faqReplies.find((item) => item.trigger.some((word) => question.includes(word)));
        return match?.answer || 'I can help draft a clear message for your doctor. Keep it short, include when symptoms started, and mention any medication or report involved.';
    }, [helperQuestion]);

    const downloadAttachment = async (messageId, name) => {
        const res = await api.get(`/chat/messages/${messageId}/attachment`, { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', name || 'attachment');
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    };

    const formatAppointment = (item) => {
        const date = item?.date
            ? new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : 'Appointment';
        return item?.time ? `${date} at ${item.time}` : date;
    };

    return (
        <div className="surface-card-lg overflow-hidden">
            <div className="border-b border-slate-100 px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">Secure follow-up</p>
                <h2 className="font-display text-lg font-bold text-slate-900">{title}</h2>
            </div>

            <div className="grid min-h-[560px] grid-cols-1 lg:grid-cols-[280px_1fr]">
                <aside className="border-b border-slate-100 bg-slate-50/80 p-4 lg:border-b-0 lg:border-r">
                    <div className="mb-3 flex items-center justify-between gap-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Appointments</p>
                        <button type="button" onClick={fetchConversations} className="text-xs font-semibold text-blue-700 hover:text-blue-900">
                            Sync
                        </button>
                    </div>

                    {loadingConversations ? (
                        <p className="py-6 text-sm text-slate-500">Loading conversations...</p>
                    ) : conversations.length === 0 ? (
                        <p className="rounded-xl border border-dashed border-slate-200 bg-white px-4 py-6 text-sm text-slate-500">
                            Conversations will appear after an appointment is created.
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {conversations.map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => setSelectedId(item.id)}
                                    className={`w-full rounded-xl border px-3 py-3 text-left transition ${
                                        selectedId === item.id
                                            ? 'border-blue-300 bg-white shadow-sm'
                                            : 'border-transparent bg-white/70 hover:border-slate-200'
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold text-slate-900">
                                                {user?.role === 'doctor' ? item.other_person?.name : `Dr. ${item.other_person?.name || 'Physician'}`}
                                            </p>
                                            <p className="mt-0.5 text-xs text-slate-500">{formatAppointment(item)}</p>
                                        </div>
                                        {item.unread_count > 0 && (
                                            <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[11px] font-bold text-white">
                                                {item.unread_count}
                                            </span>
                                        )}
                                    </div>
                                    <p className="mt-2 line-clamp-2 text-xs text-slate-500">
                                        {item.last_message?.message || item.last_message?.attachment_name || 'No messages yet'}
                                    </p>
                                </button>
                            ))}
                        </div>
                    )}
                </aside>

                <section className="flex min-h-[560px] flex-col">
                    {selectedConversation ? (
                        <>
                            <div className="border-b border-slate-100 px-5 py-4">
                                <p className="font-semibold text-slate-900">
                                    {user?.role === 'doctor'
                                        ? selectedConversation.other_person?.name
                                        : `Dr. ${selectedConversation.other_person?.name || 'Physician'}`}
                                </p>
                                <p className="text-xs text-slate-500">
                                    {formatAppointment(selectedConversation)} · {selectedConversation.status}
                                </p>
                            </div>

                            {error && <div className="mx-5 mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-800">{error}</div>}

                            <div className="flex-1 space-y-3 overflow-y-auto bg-white px-5 py-5">
                                {loadingMessages ? (
                                    <p className="py-12 text-center text-sm text-slate-500">Loading messages...</p>
                                ) : messages.length === 0 ? (
                                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
                                        <p className="font-medium text-slate-700">Start the follow-up thread</p>
                                        <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
                                            Share advice, questions, reports, or prescriptions connected to this appointment.
                                        </p>
                                    </div>
                                ) : (
                                    messages.map((item) => {
                                        const mine = item.sender_id === user?.id;
                                        return (
                                            <div key={item.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                                                <div
                                                    className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm ${
                                                        mine ? 'bg-blue-600 text-white' : 'border border-slate-200 bg-slate-50 text-slate-800'
                                                    }`}
                                                >
                                                    <p className={`mb-1 text-[11px] font-semibold ${mine ? 'text-blue-100' : 'text-slate-500'}`}>
                                                        {mine ? 'You' : item.sender?.name}
                                                    </p>
                                                    {item.message && <p className="whitespace-pre-wrap leading-relaxed">{item.message}</p>}
                                                    {item.attachment_name && (
                                                        <button
                                                            type="button"
                                                            onClick={() => downloadAttachment(item.id, item.attachment_name)}
                                                            className={`mt-2 block rounded-lg px-3 py-2 text-left text-xs font-semibold ${
                                                                mine ? 'bg-white/15 text-white hover:bg-white/20' : 'bg-white text-blue-700 hover:bg-blue-50'
                                                            }`}
                                                        >
                                                            Download {item.attachment_name}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={bottomRef} />
                            </div>

                            <div className="border-t border-slate-100 bg-slate-50/80 p-4">
                                {user?.role === 'doctor' && (
                                    <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
                                        {doctorTemplates.map((template) => (
                                            <button
                                                key={template}
                                                type="button"
                                                onClick={() => setMessage(template)}
                                                className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-blue-300 hover:text-blue-700"
                                            >
                                                Template
                                            </button>
                                        ))}
                                    </div>
                                )}

                                <div className="mb-3 rounded-xl border border-blue-100 bg-blue-50/70 p-3">
                                    <input
                                        value={helperQuestion}
                                        onChange={(event) => setHelperQuestion(event.target.value)}
                                        placeholder="Ask the assistant for FAQ help or message drafting..."
                                        className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                                    />
                                    {helperAnswer && <p className="mt-2 text-xs leading-relaxed text-blue-900">{helperAnswer}</p>}
                                </div>

                                <form onSubmit={sendMessage} className="space-y-3">
                                    <textarea
                                        value={message}
                                        onChange={(event) => setMessage(event.target.value)}
                                        rows={3}
                                        placeholder={user?.role === 'doctor' ? 'Write advice or attach a report...' : 'Ask a follow-up question...'}
                                        className="input-pro resize-none"
                                    />
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.txt"
                                            onChange={(event) => setAttachment(event.target.files?.[0] || null)}
                                            className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-white file:px-3 file:py-2 file:text-sm file:font-semibold file:text-slate-700"
                                        />
                                        <button type="submit" disabled={sending || (!message.trim() && !attachment)} className="btn-primary shrink-0 disabled:opacity-50">
                                            {sending ? 'Sending...' : 'Send'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-1 items-center justify-center p-8 text-center text-sm text-slate-500">
                            Select an appointment to open the care chat.
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
