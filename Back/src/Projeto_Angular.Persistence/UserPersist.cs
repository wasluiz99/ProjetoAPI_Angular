using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Projeto_Angular.Domain.identity;
using Projeto_Angular.Persistence.Context;
using Projeto_Angular.Persistence.Contratos;

namespace Projeto_Angular.Persistence
{
    public class UserPersist : GeralPersist, IUserPersist
    {
        private readonly Projeto_AngularContext _context;

        public UserPersist(Projeto_AngularContext context) : base(context)
        {
            _context = context;
        }
       
        public async Task<User> GetUserByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<User> GetUserByNameAsync(string username)
        {
            return await _context.Users
                                 .SingleOrDefaultAsync(u => u.UserName == username.ToLower());
        }

        public async Task<IEnumerable<User>> GetUsersAsync()
        {
            return await _context.Users.ToListAsync();
        }
    }
}