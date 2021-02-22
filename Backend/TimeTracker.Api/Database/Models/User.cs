using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace TimeTracker.Api.Database.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        [JsonIgnore]
        public byte[] Password { get; set; }
        public DateTime CreatedTime { get; set; }
        public string DiscordId { get; set; }
        [JsonIgnore]
        public List<Project> Projects { get; set; }
        [JsonIgnore]
        public List<Project> ProjectsTeaching { get; set; }
        public List<TimeEntry> TimeEntries { get; set; }
        public List<Timer> Timers { get; set; }
        public List<RefreshToken> RefreshTokens { get; set; }
    }
}
