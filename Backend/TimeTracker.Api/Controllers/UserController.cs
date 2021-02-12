using Microsoft.AspNetCore.Mvc;        // ControllerBase
using System.Threading.Tasks;          // Task
using TimeTracker.Api.DTOs;            // UserDTO
using TimeTracker.Api.Database;        // MainDb
using Microsoft.EntityFrameworkCore;   // .AsNoTracking()
using System.Linq;                     // .Where()

namespace TimeTracker.Api.Controllers {
    public class UserController : ControllerBase {

        MainDb database;

        public UserController(MainDb database) {
            this.database = database;
        }

        [HttpGet("{id}")]
        public async Task<GenericResponseDTO<UserDTO>> Get(int id) {

            var temp = await database.Users.AsNoTracking()
                .Where(user => user.Id == id)
                .ToListAsync();
            
            return new GenericResponseDTO<UserDTO>() {
                Data = new UserDTO() {
                    Email = temp[0].Email,
                    Name = temp[0].Name
                },
                Success = true
            };
        }
    }
    
}