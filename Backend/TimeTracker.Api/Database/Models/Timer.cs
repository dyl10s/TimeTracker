using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TimeTracker.Api.Database.Models
{
    public class Timer
    {
        public int Id { get; set; }
        public User User { get; set; }
        public DateTime StartTime { get; set; }
        public string Notes { get; set; }
        public Project Project { get; set; }
    }
}
