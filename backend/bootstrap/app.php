<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        //These are the files where routes are defined

        web: __DIR__.'/../routes/web.php', //routes for browser (sessions, cookies, Blade views)
        api: __DIR__.'/../routes/api.php', //routes for APIs (JSON responses, stateless)
        commands: __DIR__.'/../routes/console.php', //artisan console commands
        health: '/up', //health check endpoint (/up), is used for system monitoring.
        //“is the app working?” check for infrastructure, not for users.
    )

    
    ->withMiddleware(function (Middleware $middleware) {
    $middleware->alias([
        'role' => \App\Http\Middleware\RoleMiddleware::class, 
    ]);
})
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();