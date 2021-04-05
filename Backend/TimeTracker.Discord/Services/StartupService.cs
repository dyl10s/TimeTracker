using Discord;
using Discord.Commands;
using Discord.WebSocket;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace TimeTracker.Discord.Services
{
    public class StartupService
    {
        DiscordSocketClient client;
        IServiceProvider provider;
        CommandService commands;

        public StartupService(
            DiscordSocketClient client,
            CommandService commands,
            IServiceProvider provider)
        {
            this.client = client;
            this.provider = provider;
            this.commands = commands;
        }

        public async Task StartAsync(string botToken)
        {
            await client.LoginAsync(TokenType.Bot, botToken);
            await client.StartAsync();

            client.Ready += () =>
            {
                Console.ForegroundColor = System.ConsoleColor.Green;
                Console.WriteLine("Discord bot connected!");
                Console.ResetColor();

                return Task.CompletedTask;
            };

            await commands.AddModulesAsync(Assembly.GetExecutingAssembly(), provider);
        }
    }
}
