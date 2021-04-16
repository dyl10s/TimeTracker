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
        [Summary("Displays help information about the bot commands.")]
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
                    if(cmd.Summary != null)
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

        [Command("help")]
        [Summary("Takes an argument to search for matching NTime bot commands.")]
        public async Task Help(string command)
        {
            var result = commandService.Search(Context, command);
            if (!result.IsSuccess)
            {
                await ReplyAsync($"Sorry, I couldn't find a command like **{command}**.");
                return;
            }

            var builder = new EmbedBuilder()
            {
                Color = new Color(35, 45, 154),
                Description = $"Here are some commands like **{command}**",
                Title = "NTime Bot Commands"
            };

            string commandList = null;
            CommandInfo cmd = null;
            foreach (var match in result.Commands)
            {
                cmd = match.Command;
                if (cmd.Summary != null)
                    commandList += $"!{cmd.Aliases.First()} - {cmd.Summary}\n";
            }

            if (!string.IsNullOrWhiteSpace(commandList))
            {
                builder.AddField(x =>
                {
                    x.Name = string.Concat(
                        cmd.Module.Name.Split("Commands")[0]
                        .Select((x, i) => char.IsUpper(x) && i != 0 ? " " + x : x.ToString())
                    );
                    x.Value = commandList;
                    x.IsInline = false;
                });
            }

            await ReplyAsync("", false, builder.Build());
        }
    }
}
