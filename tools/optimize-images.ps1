# Builds web images from the original photos in assets/raw.
# For each photo: crop off the AI watermark, resize (Lanczos-like bicubic), sharpen (unsharp mask),
# add a light premium grade, and save two JPEG sizes: 800w (cards) and 1600w (large views).
# Usage: powershell -ExecutionPolicy Bypass -File tools\optimize-images.ps1

$root = Split-Path $PSScriptRoot -Parent
$raw = Join-Path $root "assets\raw"
$out = Join-Path $root "assets\products"
New-Item -ItemType Directory -Force $out | Out-Null

Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @"
using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;

public static class Img {
    public static Bitmap CropResize(Bitmap src, double keepW, double keepH, int width) {
        int cw = (int)(src.Width * keepW), ch = (int)(src.Height * keepH);
        int h = (int)Math.Round((double)ch * width / cw);
        var dst = new Bitmap(width, h, PixelFormat.Format24bppRgb);
        using (var g = Graphics.FromImage(dst)) {
            g.InterpolationMode = InterpolationMode.HighQualityBicubic;
            g.PixelOffsetMode = PixelOffsetMode.HighQuality;
            g.CompositingQuality = CompositingQuality.HighQuality;
            using (var wrap = new ImageAttributes()) {
                wrap.SetWrapMode(WrapMode.TileFlipXY); // no dark edge halo
                g.DrawImage(src, new Rectangle(0, 0, width, h), 0, 0, cw, ch, GraphicsUnit.Pixel, wrap);
            }
        }
        return dst;
    }

    // Unsharp mask + gentle contrast/saturation grade.
    public static void Enhance(Bitmap bmp, double radius, double amount, double contrast, double saturation) {
        int w = bmp.Width, h = bmp.Height;
        var rect = new Rectangle(0, 0, w, h);
        var data = bmp.LockBits(rect, ImageLockMode.ReadWrite, PixelFormat.Format24bppRgb);
        int stride = data.Stride;
        byte[] px = new byte[stride * h];
        Marshal.Copy(data.Scan0, px, 0, px.Length);

        // Gaussian kernel
        int r = (int)Math.Ceiling(radius * 3);
        double[] k = new double[r * 2 + 1]; double sum = 0;
        for (int i = -r; i <= r; i++) { k[i + r] = Math.Exp(-(i * i) / (2 * radius * radius)); sum += k[i + r]; }
        for (int i = 0; i < k.Length; i++) k[i] /= sum;

        double[] tmp = new double[w * h * 3], blur = new double[w * h * 3];
        for (int y = 0; y < h; y++) for (int x = 0; x < w; x++) for (int c = 0; c < 3; c++) {
            double acc = 0;
            for (int i = -r; i <= r; i++) { int xx = Math.Min(w - 1, Math.Max(0, x + i)); acc += px[y * stride + xx * 3 + c] * k[i + r]; }
            tmp[(y * w + x) * 3 + c] = acc;
        }
        for (int y = 0; y < h; y++) for (int x = 0; x < w; x++) for (int c = 0; c < 3; c++) {
            double acc = 0;
            for (int i = -r; i <= r; i++) { int yy = Math.Min(h - 1, Math.Max(0, y + i)); acc += tmp[(yy * w + x) * 3 + c] * k[i + r]; }
            blur[(y * w + x) * 3 + c] = acc;
        }

        for (int y = 0; y < h; y++) for (int x = 0; x < w; x++) {
            int o = y * stride + x * 3; int b = (y * w + x) * 3;
            double[] v = new double[3];
            for (int c = 0; c < 3; c++) {
                double s = px[o + c] + amount * (px[o + c] - blur[b + c]);
                v[c] = (s - 128) * contrast + 128;
            }
            double lum = 0.114 * v[0] + 0.587 * v[1] + 0.299 * v[2]; // BGR order
            for (int c = 0; c < 3; c++) {
                double s = lum + (v[c] - lum) * saturation;
                px[o + c] = (byte)Math.Max(0, Math.Min(255, Math.Round(s)));
            }
        }
        Marshal.Copy(px, 0, data.Scan0, px.Length);
        bmp.UnlockBits(data);
    }
}
"@

$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg'
function Save-Jpeg($bmp, $path, [long]$quality) {
    $ep = New-Object System.Drawing.Imaging.EncoderParameters 1
    $ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), $quality
    $bmp.Save($path, $codec, $ep)
}

$map = @{
    ant_repellent = 'ant-repellent'; black_pheny = 'black-phenyl'; bleeching_powder = 'bleaching-powder'
    concentrator = 'concentrator'; conditioner_green = 'conditioner-green'; conditioner_pink = 'conditioner-pink'
    deakay_washing_soap = 'washing-soap'; deekay_dishwash_bar = 'dishwash-bar'; deekay_glycerin = 'glycerin-soap'
    disinfectant = 'disinfectant'; dk_conditioner = 'dk-conditioner'; fabric_stiffner = 'fabric-stiffener'
    floor_cleaner_green = 'floor-cleaner-green'; floor_cleaner_red = 'floor-cleaner-red'
    lemon_grass_essential_oil = 'lemongrass-oil'; liquid = 'liquid-detergent'; rose_rich = 'rose-rich-soap'
    soap = 'ayur-soap'; soofi_aqua = 'soofi-aqua'; toilet_cleaner = 'toilet-cleaner'
}

foreach ($k in $map.Keys) {
    $src = New-Object System.Drawing.Bitmap (Join-Path $raw "$k.png")
    foreach ($size in @(@{ w = 800; q = 86; amt = 0.55 }, @{ w = 1600; q = 84; amt = 0.85 })) {
        $bmp = [Img]::CropResize($src, 0.97, 0.90, $size.w)
        [Img]::Enhance($bmp, 1.1, $size.amt, 1.05, 1.06)
        Save-Jpeg $bmp (Join-Path $out "$($map[$k])-$($size.w).jpg") $size.q
        $bmp.Dispose()
    }
    $src.Dispose()
    Write-Host "done $($map[$k])"
}
