using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TimeTracker.Api.DTOs
{
    public class ArchiveProjectDTO
    {
        public int ProjectId { get; set; }
        public bool Archive { get; set; }
    }
}
