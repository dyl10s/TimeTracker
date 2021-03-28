using Discord;
using Discord.Commands;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TimeTracker.Discord.Commands
{
    public class HelpCommands : ModuleBase<SocketCommandContext>
    {
        CommandService commandService;

        public HelpCommands(CommandService cmdService)
        {
            commandService = cmdService;
        }

        [Command("help")]
        [Summary("displays help information about the bot commands")]
        public async Task Help()
        {
            var builder = new EmbedBuilder()
            {
                Color = new Color(35, 45, 154),
                Description = "These are the commands you can use",
                Title = "NTime Bot Commands"
            };

            foreach (var module in commandService.Modules)
            {
                string commandList = null;

                foreach (var cmd in module.Commands)
                {
                    commandList += $"!{cmd.Aliases.First()} - {cmd.Summary}\n";
                }

                if (!string.IsNullOrWhiteSpace(commandList))
                {
                    builder.AddField(x =>
                    {
                        x.Name = string.Concat(
                            module.Name.Split("Commands")[0]
                            .Select((x, i) => char.IsUpper(x) && i != 0 ? " " + x : x.ToString())
                        );
                        x.Value = commandList;
                        x.IsInline = false;
                    });
                }
            }

            await ReplyAsync("", false, builder.Build());
        }
    }
}
