using Discord.Commands;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TimeTracker.Discord.Commands
{
    public class Testing : ModuleBase<SocketCommandContext>
    {
        [Command("test")]
        [Summary("Returns hello world if the bot is online.")]
        public async Task Test()
        {
            await ReplyAsync("Hello World");
        }

        [Command("echo")]
        [Summary("Returns hello world if the bot is online.")]
        public async Task Test([Remainder]string message)
        {
            await ReplyAsync(message);
        }
    }
}
