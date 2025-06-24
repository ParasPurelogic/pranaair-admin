// Simple utility to create and download PDFs directly in the browser
export function downloadPDF(filename: string, content: string): void {
  // Create a hidden iframe to render the content
  const iframe = document.createElement("iframe")
  iframe.style.display = "none"
  document.body.appendChild(iframe)

  // Write the content to the iframe
  const doc = iframe.contentWindow?.document
  if (!doc) {
    console.error("Could not access iframe document")
    return
  }

  doc.open()
  doc.write(content)
  doc.close()

  // Wait for content to load then print
  setTimeout(() => {
    try {
      // Trigger print dialog
      iframe.contentWindow?.focus()
      iframe.contentWindow?.print()

      // Clean up
      setTimeout(() => {
        document.body.removeChild(iframe)
      }, 1000)
    } catch (error) {
      console.error("Error printing document:", error)
      document.body.removeChild(iframe)
    }
  }, 1000)
}
