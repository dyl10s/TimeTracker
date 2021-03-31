using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace TimeTracker.Database.Models
{
    public class DiscordLink
    {
        public int Id { get; set; }
        public string DiscordId { get; set; }
        public string LinkKey { get; set; }
    }
}
