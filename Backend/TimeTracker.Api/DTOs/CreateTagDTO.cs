using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TimeTracker.Api.DTOs
{
    public class CreateTagDTO
    {
        public int ProjectId { get; set; }
        public string Tag { get; set; }
    }
}
