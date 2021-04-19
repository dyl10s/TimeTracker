using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TimeTracker.Api.DTOs
{
    public class ProjectRemoveUserDTO
    {
        public int ProjectId { get; set; }
        public int UserId { get; set; }
    }
}
