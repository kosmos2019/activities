using System.Linq;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using API.DTOs;
using API.Services;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;

namespace API.Controllers
{
    [AllowAnonymous]
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly TokenService _tokenService;
        private readonly IConfiguration _config;
        private readonly HttpClient _httpClient;
        public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager,
                                 TokenService tokenService, IConfiguration config)
        {
            _config = config;
            _tokenService = tokenService;
            _signInManager = signInManager;
            _userManager = userManager;
            _httpClient = new HttpClient
            {
                BaseAddress = new System.Uri("https://graph.facebook.com")
            };
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            // Return user with identity manager
            //var user = await _userManager.FindByEmailAsync(loginDto.Email);
            // Return user with EF
            var user = await _userManager.Users.Include(p => p.Photos)
                .FirstOrDefaultAsync(x => x.Email == loginDto.Email);

            if (user == null)
            {
                return Unauthorized();
            }

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

            if (result.Succeeded)
            {
                return CreateUserObject(user);
            }

            return Unauthorized();
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (await _userManager.Users.AnyAsync(x => x.Email == registerDto.Email))
            {
                ModelState.AddModelError("email", "Email taken");
                return ValidationProblem();
            }

            if (await _userManager.Users.AnyAsync(x => x.UserName == registerDto.UserName))
            {
                ModelState.AddModelError("username", "Username taken");
                return ValidationProblem();
            }

            var user = new AppUser
            {
                UserName = registerDto.UserName,
                DisplayName = registerDto.DisplayName,
                Email = registerDto.Email
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (result.Succeeded)
            {
                return CreateUserObject(user);
            }

            return BadRequest("Problem registring user");
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            // Return user with identity manager
            //var user = await _userManager.FindByEmailAsync(User.FindFirstValue(ClaimTypes.Email));
            // Return user with EF
            var user = await _userManager.Users.Include(p => p.Photos)
                .FirstOrDefaultAsync(x => x.Email == User.FindFirstValue(ClaimTypes.Email));

            if (user == null)
            {
                return null;
            }

            return CreateUserObject(user);
        }

        [HttpPost("fbLogin")]
        public async Task<ActionResult<UserDto>> FacebookLogin(string accessToken)
        {
            var fbVerifyKeys = _config["Facebook:ApiId"] + "|" + _config["Facebook:AppSecret"];
            var verifyToken = await _httpClient.GetAsync($"debug_token?input_token={accessToken}&access_token={fbVerifyKeys}");

            if (!verifyToken.IsSuccessStatusCode) return Unauthorized();

            var fbUrl = $"me?access_token={accessToken}&fields=name,email,picure.width(100).height(100)";
            var response = await _httpClient.GetAsync(fbUrl);

            if (!response.IsSuccessStatusCode) return Unauthorized();

            var content = await response.Content.ReadAsStringAsync();
            var fbInfo = JsonConvert.DeserializeObject<dynamic>(content);

            return new UserDto();
        }

        private UserDto CreateUserObject(AppUser user)
        {
            return new UserDto
            {
                DisplayName = user.DisplayName,
                UserName = user.UserName,
                Image = user?.Photos?.FirstOrDefault(x => x.IsMain)?.Url,
                Token = _tokenService.CreateToken(user)
            };
        }
    }
}