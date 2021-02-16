using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TimeTracker.Api.Database.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public byte[] Password { get; set; }
        public DateTime CreatedTime { get; set; }
        public string DiscordId { get; set; }
        public List<Project> Projects { get; set; }
        public List<TimeEntry> TimeEntries { get; set; }
        public List<Timer> Timers { get; set; }
        public List<RefreshToken> RefreshTokens { get; set; }
    }
}
