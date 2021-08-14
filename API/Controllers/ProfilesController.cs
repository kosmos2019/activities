using System.Threading.Tasks;
using Activities = Application.Activities;
using Application.Profiles;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProfilesController : BaseApiController
    {
        [HttpGet("{username}/activities")]
        public async Task<IActionResult> GetActivities(string username, string predicate)
        {
            return HandleResult(await Mediator.Send(new ListActivities.Query { Predicate = predicate, UserName = username }));
        }

        [HttpGet("{username}/activitiesbis")]
        public async Task<IActionResult> GetActivitiesBis(string username, string predicate)
        {
            return HandleResult(await Mediator.Send(new ListActivitiesBis.Query { Predicate = predicate, UserName = username }));
        }

        [HttpGet("{username}")]
        public async Task<IActionResult> GetProfile(string username)
        {
            return HandleResult(await Mediator.Send(new Details.Query { UserName = username }));
        }

        [HttpPut]
        public async Task<IActionResult> Update(Edit.Command command)
        {
            return HandleResult(await Mediator.Send(command));
        }
    }
}