import { Button } from '@chakra-ui/react';
import { PDFDocument } from 'pdf-lib';

export const Testing=()=>{
    async function loadPDF() {
        try {
            const existingPdfBytes ="./Sample_project_wad.pdf"; // Provide your existing PDF bytes here
            const pdfDoc = await PDFDocument.load(existingPdfBytes);
            console.log('PDF parsed successfully');
            return pdfDoc;
        } catch (error) {
            console.error('Failed to parse PDF document:', error);
            throw error;
        }
    }
    
    // Call the function to load the PDF
    loadPDF().then((pdfDoc) => {
        // PDF loaded successfully, continue processing
    }).catch((error) => {
        // Handle parsing errors
    });
    return(
        <Button onClick={loadPDF}>Testing</Button>
    )    
}