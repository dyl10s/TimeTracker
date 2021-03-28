using Discord.Commands;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TimeTracker.Discord.Commands
{
    public class AuthCommands : ModuleBase<SocketCommandContext>
    {
        [Command("login")]
        [Summary("Allows the user to link their Discord account with their NTime account.")]
        public async Task Login()
        {
            await ReplyAsync("Hello World");
        }
    }
}
