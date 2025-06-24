// Helper function to create a PDF download using browser print
export function createPDFDownload(htmlContent: string, filename: string): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      // Create a hidden iframe
      const iframe = document.createElement("iframe")
      iframe.style.cssText = `
        position: fixed;
        width: 0;
        height: 0;
        border: none;
        visibility: hidden;
      `

      document.body.appendChild(iframe)

      const doc = iframe.contentWindow?.document
      if (!doc) {
        throw new Error("Could not access iframe document")
      }

      // Enhanced HTML with print optimization
      const enhancedHTML = htmlContent.replace(
        "</head>",
        `
        <style>
          @media print {
            /* Ensure PDF generation settings */
            @page {
              size: A4;
              margin: 0;
            }
            
            /* Hide scrollbars and ensure full page */
            html, body {
              overflow: hidden;
              height: 297mm;
              width: 210mm;
            }
          }
        </style>
        <script>
          // Auto-print configuration
          window.onload = function() {
            // Set document title for PDF filename
            document.title = '${filename}';
            
            // Configure print settings
            if (window.matchMedia) {
              const mediaQueryList = window.matchMedia('print');
              mediaQueryList.addListener(function(mql) {
                if (!mql.matches) {
                  // Print dialog was closed
                  setTimeout(function() {
                    window.close();
                  }, 100);
                }
              });
            }
            
            // Trigger print after a short delay
            setTimeout(function() {
              window.print();
            }, 250);
          };
          
          // Handle after print
          window.onafterprint = function() {
            window.close();
          };
        </script>
        </head>
        `,
      )

      doc.open()
      doc.write(enhancedHTML)
      doc.close()

      // Clean up after delay
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe)
        }
        resolve()
      }, 5000)
    } catch (error) {
      reject(error)
    }
  })
}

// Alternative method using blob for direct download
export function downloadAsPDF(htmlContent: string, filename: string): void {
  // Create a Blob with enhanced HTML
  const enhancedHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${filename}</title>
      <style>
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
        }
      </style>
    </head>
    <body>
      ${htmlContent}
      <script>
        // Auto-open print dialog when opened
        window.addEventListener('load', function() {
          setTimeout(function() {
            window.print();
          }, 100);
        });
      </script>
    </body>
    </html>
  `

  const blob = new Blob([enhancedHTML], { type: "text/html;charset=utf-8" })
  const url = URL.createObjectURL(blob)

  // Create download link
  const link = document.createElement("a")
  link.href = url
  link.download = `${filename}.html`
  link.style.display = "none"

  document.body.appendChild(link)
  link.click()

  // Cleanup
  setTimeout(() => {
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, 100)
}
