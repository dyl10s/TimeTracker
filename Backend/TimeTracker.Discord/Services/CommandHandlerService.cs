using Discord.Commands;
using Discord.WebSocket;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TimeTracker.Discord.Services
{
    public class CommandHandlerService
    {
        DiscordSocketClient client;
        CommandService commands;
        IServiceProvider provider;

        public CommandHandlerService(
            DiscordSocketClient client,
            CommandService commands,
            IServiceProvider provider)
        {
            this.client = client;
            this.commands = commands;
            this.provider = provider;

            client.MessageReceived += OnMessageReceivedAsync;
        }

        private async Task OnMessageReceivedAsync(SocketMessage message)
        {
            var userMessage = message as SocketUserMessage;

            // Validate the message
            if (userMessage == null || userMessage.Author.Id == client.CurrentUser.Id) {
                return;
            };

            var context = new SocketCommandContext(client, userMessage);

            int prefixPosition = 0;
            if (userMessage.HasStringPrefix("!", ref prefixPosition))
            {
                await commands.ExecuteAsync(context, prefixPosition, provider);
            }
        }
    }
}
