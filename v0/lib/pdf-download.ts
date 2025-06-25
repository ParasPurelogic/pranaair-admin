// Alternative method to generate PDF using print media
export function downloadAsPDF(htmlContent: string, filename: string): void {
  // Create a hidden iframe
  const iframe = document.createElement("iframe")
  iframe.style.position = "absolute"
  iframe.style.width = "0"
  iframe.style.height = "0"
  iframe.style.border = "none"
  iframe.style.visibility = "hidden"

  // Add to document
  document.body.appendChild(iframe)

  // Write content to iframe
  const doc = iframe.contentWindow?.document
  if (!doc) {
    console.error("Could not access iframe document")
    document.body.removeChild(iframe)
    return
  }

  // Add print-specific meta tags and scripts
  const enhancedHTML = htmlContent.replace(
    "</head>",
    `
    <script>
      window.onload = function() {
        // Auto-trigger print dialog
        window.print();
        
        // Listen for print completion
        window.onafterprint = function() {
          // Close the window after printing
          window.close();
        }
      }
    </script>
    </head>
    `,
  )

  doc.open()
  doc.write(enhancedHTML)
  doc.close()

  // Clean up after a delay
  setTimeout(() => {
    if (document.body.contains(iframe)) {
      document.body.removeChild(iframe)
    }
  }, 5000)
}

// Convert HTML to PDF-ready format
export function preparePDFContent(html: string, title: string): string {
  return html.replace(
    "<title>",
    `<meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <title>`,
  )
}
