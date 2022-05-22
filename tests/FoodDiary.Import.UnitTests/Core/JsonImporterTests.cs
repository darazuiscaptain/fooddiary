﻿using System.Linq;
using AutoFixture;
using FluentAssertions;
using FoodDiary.Contracts.Export.Json;
using FoodDiary.Domain.Entities;
using FoodDiary.Import.Core;
using FoodDiary.Import.Services;
using FoodDiary.Import.UnitTests.Attributes;
using Moq;
using Xunit;

namespace FoodDiary.Import.UnitTests.Core
{
    public class JsonImporterTests
    {
        private readonly Mock<IPageJsonImporter> _pageJsonImporterMock;

        private readonly IFixture _fixture = Fixtures.Custom;

        public JsonImporterTests()
        {
            _pageJsonImporterMock = new Mock<IPageJsonImporter>();
        }

        delegate void PageJsonImporterMockingCallback(JsonExportPageDto pageFromJson, out Page createdPage);

        public IJsonImporter Sut => new JsonImporter(_pageJsonImporterMock.Object);

        [Theory]
        [JsonObjectWithUniquePagesAutoData]
        public void Import_CreatesAndUpdatesPages(JsonExportFileDto jsonObj)
        {
            var createdPageBeforeImport = _fixture.Create<Page>();
            var createdPageAfterImport = _fixture.Create<Page>();
            var expectedCreatedPages = Enumerable.Repeat(createdPageAfterImport, jsonObj.Pages.Count())
                .ToList();

            _pageJsonImporterMock.Setup(i => i.ImportPage(It.IsNotNull<JsonExportPageDto>(), out createdPageBeforeImport))
                .Callback(new PageJsonImporterMockingCallback((JsonExportPageDto pageFromJson, out Page createdPage) =>
                {
                    createdPage = createdPageAfterImport;
                }));

            Sut.Import(jsonObj, out var createdPages);
            createdPages.Should().Contain(expectedCreatedPages);
        }
    }
}
