using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TimeTracker.Api.Database.Models
{
    public class Tag
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public Project Project { get; set;}
    }
}
