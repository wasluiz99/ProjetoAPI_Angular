using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace Projeto_Angular.Domain.identity
{
    public class Role : IdentityRole<int>
    {
        public IEnumerable<UserRole> UserRoles { get; set; }
    }
}