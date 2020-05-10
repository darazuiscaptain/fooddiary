﻿using System;
using System.Collections.Generic;
using System.Linq;
using FoodDiary.Domain.Dtos;
using FoodDiary.Domain.Entities;
using FoodDiary.Import.Services;

namespace FoodDiary.Import.Implementation
{
    class PageJsonImporter : IPageJsonImporter
    {
        private readonly IJsonImportDataProvider _importDataProvider;

        private readonly INoteJsonImporter _noteImporter;

        public PageJsonImporter(IJsonImportDataProvider importDataProvider, INoteJsonImporter noteImporter)
        {
            _importDataProvider = importDataProvider ?? throw new ArgumentNullException(nameof(importDataProvider));
            _noteImporter = noteImporter ?? throw new ArgumentNullException(nameof(noteImporter));
        }

        public void ImportPage(PageJsonItemDto pageFromJson, out Page createdPage)
        {
            if (pageFromJson == null)
                throw new ArgumentNullException(nameof(pageFromJson));

            if (pageFromJson.Notes == null)
                throw new ArgumentNullException(nameof(pageFromJson.Notes));

            var existingPagesDictionary = _importDataProvider.ExistingPages;
            Page importedPage;
            createdPage = null;

            if (existingPagesDictionary.ContainsKey(pageFromJson.Date))
                importedPage = existingPagesDictionary[pageFromJson.Date];
            else
            {
                importedPage = createdPage = new Page()
                {
                    Date = pageFromJson.Date
                };
            }

            importedPage.Notes = pageFromJson.Notes
                .Select(n => _noteImporter.ImportNote(n))
                .ToList();
        }
    }
}
