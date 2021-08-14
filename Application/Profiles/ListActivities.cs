using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class ListActivities
    {
        public class Query : IRequest<Result<List<UserActivityDto>>>
        {
            public string Predicate { get; set; }
            public string UserName { get; set; }
        }
        public class Handler : IRequestHandler<Query, Result<List<UserActivityDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }
            public async Task<Result<List<UserActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var query = _context.Activities
                    .Where(x => x.Attendees.Any(a => a.AppUser.UserName == request.UserName))
                    .OrderBy(d => d.Date)
                    .ProjectTo<UserActivityDto>(_mapper.ConfigurationProvider,
                        new { currentUserName = request.UserName })
                    .AsQueryable();

                query = request.Predicate switch
                {
                    "past" => query.Where(d => d.Date <= DateTime.UtcNow),
                    "hosting" => query.Where(x => x.HostUserName == request.UserName),
                    _ => query.Where(d => d.Date >= DateTime.UtcNow)
                };

                return Result<List<UserActivityDto>>.Success(await query.ToListAsync());
            }
        }
    }
}