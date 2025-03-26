using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Projeto_Angular.Application.Dtos;

namespace Projeto_Angular.Application.Contratos
{
    public interface IAccountService
    {
        Task<Boolean> UserExist(string username);
        Task<UserUpdateDto> GetUserByNameAsync(string username);
        Task<SignInResult> CheckUserPasswordAsync(UserUpdateDto userUpdateDto, string password);
        Task<UserDto> CreteAccountAsync(UserDto userDto);
        Task<UserUpdateDto> UpdateAccountAsync(UserUpdateDto userUpdateDto);


    }
}