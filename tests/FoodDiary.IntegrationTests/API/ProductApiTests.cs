using System.Net;
using System.Net.Http.Json;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using FoodDiary.Contracts.Products;
using FoodDiary.Domain.Entities;
using FoodDiary.Infrastructure;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace FoodDiary.IntegrationTests.API;

public class ProductApiTests : IClassFixture<FoodDiaryWebApplicationFactory>
{
    private readonly FoodDiaryWebApplicationFactory _webApplicationFactory;

    public ProductApiTests(FoodDiaryWebApplicationFactory webApplicationFactory)
    {
        _webApplicationFactory = webApplicationFactory;
    }

    [Fact]
    public async Task Gets_product_dropdown_items_ordered_by_name()
    {
        var context = _webApplicationFactory.Services.GetRequiredService<FoodDiaryContext>();
        context.Products.AddRange(new []
        {
            new Product
            {
                Id = 1,
                Name = "Milk",
            },
            new Product
            {
                Id = 2,
                Name = "Bread",
            }
        });
        await context.SaveChangesAsync();
        
        var client = _webApplicationFactory.CreateClient();
        
        var response = await client.GetAsync("/api/v1/products/dropdown", CancellationToken.None);

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var dropdownItems = await response.Content.ReadFromJsonAsync<ProductDropdownItemDto[]>();
        dropdownItems.Should().ContainInOrder(
            new ProductDropdownItemDto
            {
                Id = 2,
                Name = "Bread"
            },
            new ProductDropdownItemDto
            {
                Id = 1,
                Name = "Milk"
            }
        );
    }
}