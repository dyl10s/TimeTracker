using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TimeTracker.Api.DTOs
{
    public class RefreshDTO
    {
        public string Email { get; set; }
        public string RefreshToken { get; set; }
    }
}
