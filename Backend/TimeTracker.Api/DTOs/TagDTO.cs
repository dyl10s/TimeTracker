using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace TimeTracker.Api.DTOs {
    public class TagDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public ProjectDTO Project { get; set;}
    }
}