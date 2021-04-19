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

        [Command("help-auth")]
        [Summary("Displays further description of the auth commands including acceptable parameters.")]
        public async Task authHelp()
        {
            var builder = new EmbedBuilder()
            {
                Color = new Color(35, 45, 154),
                Title = "NTime Auth Help",
                Description = "Here is a further description of the auth commands"
            };

            builder.AddField(x =>
            {
                x.Name = "!login";
                x.Value = "This command will direct message the user a link to be redirected to NTime login " +
                "and connect the Discord bot to their NTime account for the integrated bot feature use.";
                x.IsInline = false;
            });

            builder.AddField(x =>
            {
                x.Name = "!unlink";
                x.Value = "This command will allow the user to disconnect the Discord bot from their NTime account " +
                "to remove the integrated bot features.";
                x.IsInline = false;
            });
            await ReplyAsync("", false, builder.Build());
        }


        [Command("help-timer")]
        [Summary("Displays further description of the timer commands including acceptable parameters.")]
        public async Task timerHelp()
        {
            var builder = new EmbedBuilder()
            {
                Color = new Color(35, 45, 154),
                Title = "NTime Timer Help",
                Description = "Here is a futher description of the timer commands"
            };

            builder.AddField(x =>
            {
                x.Name = "!start";
                x.Value = "This command will allow the user to start an NTime timer on their accounts via discord. " +
                " A timer will start on the users project without a timer, and if multiple projects dont have timers" +
                " the user will be prompted to select a specific project to start the timer.";
                x.IsInline = false;
            });

            builder.AddField(x =>
            {
                x.Name = "!start  [project ID]";
                x.Value = "This command will allow the user to start an NTime timer on their accounts via discord. " +
                " A timer will be started on the users project with the specified ID if one is found.";
                x.IsInline = false;
            });

            builder.AddField(x =>
            {
                x.Name = "!start  [project name]";
                x.Value = "This command will allow the user to start an NTime timer on their accounts via discord." +
                " A timer will be started on the users project with the specified name if one is found.";
                x.IsInline = false;
            });

            builder.AddField(x =>
            {
                x.Name = "\u200B";
                x.Value = "\u200B";
                x.IsInline = false;
            });

            builder.AddField(x =>
            {
                x.Name = "!stop";
                x.Value = "This command will allow the user to stop an NTime timer on their accounts via discord. " +
                "The least recently started timer will be stopped within a users projects. If the user only has" +
                " one timer running this means that timer will be stopped. This will result in the creation of a" +
                " time entry on the project of the timer and the user will be returned the timers data. ";
                x.IsInline = false;
            });

            builder.AddField(x =>
            {
                x.Name = "!stop [timer ID]";
                x.Value = "This command will allow the user to stop an NTime timer by ID on their accounts via discord. " +
                "This will result in the creation of a time entry on the project of the timer and the user will be returned the timers data.";
                x.IsInline = false;
            });

            builder.AddField(x =>
            {
                x.Name = "!stop [project name]";
                x.Value = "This command will allow the user to stop an NTime timer by project name on their accounts via discord. " +
                          "The timer running on the specified project name will be stopped. This will result in the creation of a " +
                          "time entry on the project of the timer and the user will be returned the timers data. ";
                x.IsInline = false;
            });

            builder.AddField(x =>
            {
                x.Name = "\u200B";
                x.Value = "\u200B";
                x.IsInline = false;
            });

            builder.AddField(x =>
            {
                x.Name = "!timers";
                x.Value = "This command will return the user a list of all timers currently active by project, along with their data. " +
                "In the case of no active timers the user will be alerted.";
                x.IsInline = false;
            });

            await ReplyAsync("", false, builder.Build());
        }
    }
}
