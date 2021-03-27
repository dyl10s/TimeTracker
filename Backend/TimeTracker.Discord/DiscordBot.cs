﻿using Discord;
using Discord.Commands;
using Discord.WebSocket;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;
using TimeTracker.Discord.Services;

namespace TimeTracker.Discord
{
    public class DiscordBot
    {
        DiscordSocketClient client;
        CommandService commands;

        string discordToken = "";

        public DiscordBot(string token)
        {
            discordToken = token;
            Thread botThread = new Thread(StartBot);
            botThread.Start();
        }

        private void StartBot()
        {
            RunBotAsync().GetAwaiter().GetResult();
        }

        private async Task RunBotAsync()
        {
            var services = new ServiceCollection();
            ConfigureServices(services);

            var provider = services.BuildServiceProvider();

            // Init services
            provider.GetRequiredService<CommandHandlerService>();

            // Start the bot
            await provider.GetRequiredService<StartupService>().StartAsync(discordToken);

            // Keep the bot alive
            await Task.Delay(-1);
        }

        private void ConfigureServices(IServiceCollection services)
        {
            services.AddSingleton(new DiscordSocketClient(new DiscordSocketConfig
            {
                LogLevel = LogSeverity.Verbose,
                MessageCacheSize = 100
            }))
            .AddSingleton(new CommandService(new CommandServiceConfig
            {
                LogLevel = LogSeverity.Verbose,
                DefaultRunMode = RunMode.Async,
            }))
            .AddSingleton<CommandHandlerService>()
            .AddSingleton<StartupService>();
        }
    }
}
