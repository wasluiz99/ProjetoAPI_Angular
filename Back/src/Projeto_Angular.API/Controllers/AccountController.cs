using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Projeto_Angular.API.Extensions;
using Projeto_Angular.Application.Contratos;
using Projeto_Angular.Application.Dtos;

namespace Projeto_Angular.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly IAccountService _accountService;
        private readonly ITokenService _tokenService;

        public AccountController(IAccountService accountService,
                                ITokenService tokenService)
        {
            _accountService = accountService;
            _tokenService = tokenService;
        }

        [HttpGet("GetUser")]
        public async Task<IActionResult> GetUser()
        {
            try
            {

                var userName = User.GetUserName();
                var user = await _accountService.GetUserByNameAsync(userName);

                return Ok(user);
            }
            catch (Exception ex)
            {
                
                return StatusCode(StatusCodes.Status500InternalServerError,
                $"Erro ao tentar recuperar Usuário. Erro: {ex.Message}");
            }
        }

        [HttpPost("Register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register(UserDto userDto)
        {
            try
            {
                if(await _accountService.UserExist(userDto.UserName))
                    return BadRequest("Usuário já existe.");

                var user = await _accountService.CreteAccountAsync(userDto);
                if(user != null)
                    return Ok("Usuário cadastrado.");


                return BadRequest("Usuário não criado, tente novamente mais tarde!");

            }
            catch (Exception ex)
            {
                
                return StatusCode(StatusCodes.Status500InternalServerError,
                $"Erro ao tentar registrar Usuário. Erro: {ex.Message}");
            }
        }

        [HttpPost("Login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login(UserLoginDto userLoginDto)
        {
            try
            {
                var user = await _accountService.GetUserByNameAsync(userLoginDto.UserName);
                if(user == null) return Unauthorized("Usuario ou Senha esta errado.");

                var result = await _accountService.CheckUserPasswordAsync(user, userLoginDto.Password);
                if(!result.Succeeded) return Unauthorized();

                return Ok(new {
                    userName = user.UserName,
                    PrimeiroNome = user.PrimeiroNome,
                    token = _tokenService.CreateToken(user).Result
                });
            }
            catch (Exception ex)
            {
                
                return StatusCode(StatusCodes.Status500InternalServerError,
                $"Erro ao tentar realizar Login. Erro: {ex.Message}");
            }
        }

        [HttpPut("UpdateUser")]
        public async Task<IActionResult> UpdateUser(UserUpdateDto userUpdateDto)
        {
            try
            {
                var user = await _accountService.GetUserByNameAsync(User.GetUserName());
                if(user == null) return Unauthorized("Usuario invalido.");

                var userReturn = await _accountService.UpdateAccountAsync(userUpdateDto);
                if(userReturn == null) return NoContent();


                return Ok(userReturn);

            }
            catch (Exception ex)
            {
                
                return StatusCode(StatusCodes.Status500InternalServerError,
                $"Erro ao tentar atualizar Usuário. Erro: {ex.Message}");
            }
        }
    }
}