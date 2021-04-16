using Discord;
using Discord.Commands;
using Discord.WebSocket;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TimeTracker.Database;
using TimeTracker.Database.Models;

namespace TimeTracker.Discord.Commands
{
    public class AuthCommands : ModuleBase<SocketCommandContext>
    {
        MainDb database;
        IConfiguration configuration;
        CommandService commandService;

        public AuthCommands(MainDb db, IConfiguration config, CommandService commandService)
        {
            database = db;
            configuration = config;
            commandService = commandService;
        }

        [Command("login")]
        [Summary("Allows the user to link their Discord account with their NTime account.")]
        public async Task Login()
        {
            var currentUser = Context.User;

            // Check to make sure the user is not already linked
            var alreadyLinkedUser = await database.Users
                .AsQueryable()
                .Where(x => x.DiscordId == currentUser.Id.ToString())
                .FirstOrDefaultAsync();

            if (alreadyLinkedUser != null)
            {
                await ReplyAsync(
                    $@"{currentUser.Mention} your account is already linked with the email, {alreadyLinkedUser.Email}." +
                    "If you would like to unlink you account you can use the `!unlink` command."
                );
                return;
            }

            var linkKey = Guid.NewGuid().ToString().Replace("-", "") + Guid.NewGuid().ToString().Replace("-", "");
            var discordId = currentUser.Id;

            var discordLink = new DiscordLink()
            {
                DiscordId = discordId.ToString(),
                LinkKey = linkKey
            };

            database.Add(discordLink);
            await database.SaveChangesAsync();

            await ReplyAsync($"{currentUser.Mention} a direct message has been sent with further instructions for setting up your account.");

            await currentUser.SendMessageAsync(
                "Please login to your NTime account using the following link to link your discord account to your NTime account " +
                configuration["WebsiteLink"] + "auth/login?discordLink=" + linkKey
            );
        }

        [Command("unlink")]
        [Summary("Allows the user to unlink their Discord account with their NTime account.")]
        public async Task Unlink()
        {
            var currentUser = Context.User;
            var linkedUser = await database.Users
                .AsQueryable()
                .Where(x => x.DiscordId == currentUser.Id.ToString())
                .FirstOrDefaultAsync();

            if(linkedUser == null)
            {
                await ReplyAsync("Your Discord account is currently not linked to any NTime account.");
                return;
            }

            linkedUser.DiscordId = null;
            await database.SaveChangesAsync();

            await ReplyAsync("Your Discord account has been unlinked from your NTime account.");
        }


        [Command("help-auth")]
        [Summary("Displays further description of the auth commands.")]
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
    }
}
