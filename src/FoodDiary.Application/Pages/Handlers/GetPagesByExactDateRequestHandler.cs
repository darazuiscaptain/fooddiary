﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FoodDiary.Application.Pages.Requests;
using FoodDiary.Domain.Entities;
using FoodDiary.Domain.Repositories;
using MediatR;

namespace FoodDiary.Application.Pages.Handlers
{
    public class GetPagesByExactDateRequestHandler : IRequestHandler<GetPagesByExactDateRequest, List<Page>>
    {
        private readonly IPageRepository _pageRepository;

        public GetPagesByExactDateRequestHandler(IPageRepository pageRepository)
        {
            _pageRepository = pageRepository ?? throw new ArgumentNullException(nameof(pageRepository));
        }

        public Task<List<Page>> Handle(GetPagesByExactDateRequest request, CancellationToken cancellationToken)
        {
            var query = _pageRepository.GetQueryWithoutTracking().Where(p => p.Date == request.Date);
            return _pageRepository.GetListFromQueryAsync(query, cancellationToken);
        }
    }
}
