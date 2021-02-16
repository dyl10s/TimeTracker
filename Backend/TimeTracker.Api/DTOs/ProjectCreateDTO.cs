using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TimeTracker.Api.DTOs
{
    public class ProjectCreateDTO
    {
        public string ProjectName { get; set; }
        public string ClientName { get; set; }
        public string Description { get; set; }
        public List<string> Tags { get; set; }
    }
}
