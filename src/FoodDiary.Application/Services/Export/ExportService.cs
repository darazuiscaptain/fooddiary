#nullable enable
using System.IO;
using System.Text.Encodings.Web;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using FoodDiary.Export.GoogleDocs;
using FoodDiary.Export.GoogleDocs.Contracts;

namespace FoodDiary.Application.Services.Export;

internal class ExportService : IExportService
{
    private readonly IExportDataLoader _exportDataLoader;
    private readonly IGoogleDocsExportService _googleDocsService;
    private readonly IGoogleAccessTokenProvider _googleAccessTokenProvider;

    public ExportService(IExportDataLoader exportDataLoader,
        IGoogleDocsExportService googleDocsService,
        IGoogleAccessTokenProvider googleAccessTokenProvider)
    {
        _exportDataLoader = exportDataLoader;
        _googleDocsService = googleDocsService;
        _googleAccessTokenProvider = googleAccessTokenProvider;
    }
    
    public async Task<ExportToGoogleDocsResponseDto> ExportToGoogleDocsAsync(ExportToGoogleDocsRequestDto request,
        CancellationToken cancellationToken)
    {
        var exportFileDto = await _exportDataLoader.GetDataAsync(request.StartDate,
            request.EndDate,
            cancellationToken);

        var accessToken = await _googleAccessTokenProvider.GetAccessTokenAsync();
        var exportRequest = new ExportRequest(accessToken, exportFileDto);
        var documentId = await _googleDocsService.ExportAsync(exportRequest, cancellationToken);

        return new ExportToGoogleDocsResponseDto
        {
            DocumentId = documentId
        };
    }

    public async Task<byte[]> ExportToJsonAsync(ExportRequestDto request, CancellationToken cancellationToken)
    {
        var exportFileDto = await _exportDataLoader.GetJsonDataAsync(request.StartDate,
            request.EndDate,
            cancellationToken);

        using var stream = new MemoryStream();
        
        var serializerOptions = new JsonSerializerOptions
        { 
            WriteIndented = true, 
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping
        };

        await JsonSerializer.SerializeAsync(stream, exportFileDto, serializerOptions, cancellationToken);
        return stream.ToArray();
    }
}