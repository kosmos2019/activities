using System.Linq;
using Application.Activities;
using Application.Comments;
using Profiles = Application.Profiles;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            string currentUserName = null;

            CreateMap<Activity, Activity>();
            CreateMap<Activity, ActivityDto>()
                .ForMember(a => a.HostUserName, b => b.MapFrom(c => c.Attendees
                    .FirstOrDefault(d => d.IsHost).AppUser.UserName));
            CreateMap<ActivityAttendee, AttendeeDto>()
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName))
                .ForMember(d => d.UserName, o => o.MapFrom(s => s.AppUser.UserName))
                .ForMember(d => d.Bio, o => o.MapFrom(s => s.AppUser.Bio))
                .ForMember(d => d.Image, o => o.MapFrom(s => s.AppUser.Photos.FirstOrDefault(x => x.IsMain).Url))
                .ForMember(d => d.Following, o => o.MapFrom(s => s.AppUser.Followers.Any(x => x.Observer.UserName == currentUserName)))
                .ForMember(d => d.FollowersCount, o => o.MapFrom(s => s.AppUser.Followers.Count))
                .ForMember(d => d.FollowingsCount, o => o.MapFrom(s => s.AppUser.Followings.Count));
            CreateMap<AppUser, Profiles.Profile>()
                .ForMember(d => d.Image, o => o.MapFrom(s => s.Photos.FirstOrDefault(x => x.IsMain).Url))
                .ForMember(d => d.Following, o => o.MapFrom(s => s.Followers.Any(x => x.Observer.UserName == currentUserName)))
                .ForMember(d => d.FollowersCount, o => o.MapFrom(s => s.Followers.Count))
                .ForMember(d => d.FollowingsCount, o => o.MapFrom(s => s.Followings.Count));
            CreateMap<Comment, CommentDto>()
                .ForMember(c => c.UserName, o => o.MapFrom(u => u.Author.UserName))
                .ForMember(c => c.DisplayName, o => o.MapFrom(u => u.Author.DisplayName))
                .ForMember(c => c.Image, o => o.MapFrom(u => u.Author.Photos.FirstOrDefault(x => x.IsMain).Url));
            CreateMap<Activity, Profiles.UserActivityDto>()
                .ForMember(c => c.HostUserName, d => d.MapFrom(c => c.Attendees.FirstOrDefault(u => u.IsHost).AppUser.UserName));
            CreateMap<ActivityAttendee, Profiles.UserActivityDto>()
                .ForMember(c => c.Id, o => o.MapFrom(a => a.ActivityId))
                .ForMember(c => c.Title, o => o.MapFrom(a => a.Activity.Title))
                .ForMember(c => c.Category, o => o.MapFrom(a => a.Activity.Category))
                .ForMember(c => c.Date, o => o.MapFrom(a => a.Activity.Date))
                .ForMember(c => c.HostUserName, o => o.MapFrom(c =>
                    c.Activity.Attendees.FirstOrDefault(u => u.IsHost).AppUser.UserName));
        }
    }
}