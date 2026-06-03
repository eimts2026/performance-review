export const exportAppraisalToPDF = async (appraisal) => {
    const printWindow = window.open('', '', 'height=800,width=1000');
    
    // Helper to format date
    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const ratingLabels = {
        'A': 'A - Excellent / Outstanding',
        'B': 'B - Good / Exceeds Expectations',
        'C': 'C - Satisfactory / Meets Expectations',
        'D': 'D - Marginal / Needs Improvement',
        'E': 'E - Unsatisfactory'
    };

    const formatRating = (rating) => {
        if (!rating) return 'Not Evaluated';
        return ratingLabels[rating.toUpperCase()] || rating;
    };

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Performance Appraisal Report - ${appraisal.employee_name}</title>
        <style>
            @media print {
                @page {
                    size: A4 portrait;
                    margin: 20mm;
                }
                body {
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
            }
            
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Times New Roman', Times, Georgia, serif;
                color: #111;
                background-color: #fff;
                line-height: 1.5;
                font-size: 11pt;
            }
            
            .report-container {
                max-width: 800px;
                margin: 0 auto;
                padding: 10px;
            }
            
            .company-header {
                text-align: center;
                margin-bottom: 25px;
                border-bottom: 2px double #333;
                padding-bottom: 15px;
            }
            
            .company-header h1 {
                font-size: 20pt;
                font-weight: bold;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 5px;
            }
            
            .company-header p {
                font-size: 10pt;
                font-style: italic;
                color: #555;
            }
            
            .document-title {
                text-align: center;
                font-size: 14pt;
                font-weight: bold;
                text-transform: uppercase;
                margin-bottom: 20px;
                letter-spacing: 0.5px;
                text-decoration: underline;
            }
            
            .meta-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 25px;
            }
            
            .meta-table td {
                border: 1px solid #333;
                padding: 8px 12px;
                font-size: 10pt;
                vertical-align: top;
            }
            
            .meta-table td.label {
                font-weight: bold;
                background-color: #f7f7f7;
                width: 25%;
            }
            
            .meta-table td.value {
                width: 25%;
            }
            
            .section-heading {
                font-size: 12pt;
                font-weight: bold;
                text-transform: uppercase;
                border-bottom: 1.5px solid #333;
                padding-bottom: 4px;
                margin: 25px 0 12px 0;
                page-break-after: avoid;
            }
            
            .ratings-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 15px;
            }
            
            .ratings-table th, .ratings-table td {
                border: 1px solid #333;
                padding: 8px 10px;
                font-size: 10pt;
                text-align: left;
            }
            
            .ratings-table th {
                background-color: #eee;
                font-weight: bold;
                text-transform: uppercase;
                font-size: 9pt;
            }
            
            .narrative-block {
                margin-bottom: 15px;
                page-break-inside: avoid;
            }
            
            .narrative-title {
                font-weight: bold;
                font-size: 10.5pt;
                margin-bottom: 5px;
            }
            
            .narrative-content {
                border: 1px solid #333;
                padding: 10px 12px;
                min-height: 80px;
                background-color: #fafafa;
                font-size: 10pt;
                white-space: pre-line;
            }
            
            .signatures-container {
                margin-top: 50px;
                width: 100%;
                border-collapse: collapse;
                page-break-inside: avoid;
            }
            
            .signatures-container td {
                width: 33%;
                padding: 0 15px;
                vertical-align: bottom;
                border: none;
            }
            
            .signature-line {
                border-top: 1px solid #333;
                margin-top: 45px;
                text-align: center;
                font-size: 9pt;
                padding-top: 5px;
            }
        </style>
    </head>
    <body>
        <div class="report-container">
            <div class="company-header">
                <h1>Emerald Isle Manpower</h1>
                <p>Human Resources Department — Employee Performance Management</p>
            </div>
            
            <div class="document-title">
                Employee Performance Appraisal
            </div>
            
            <table class="meta-table">
                <tr>
                    <td class="label">Employee Name:</td>
                    <td class="value">${appraisal.employee_name}</td>
                    <td class="label">Employee ID:</td>
                    <td class="value">${appraisal.employee_id}</td>
                </tr>
                <tr>
                    <td class="label">Job Position:</td>
                    <td class="value">${appraisal.position || 'N/A'}</td>
                    <td class="label">Date Joined:</td>
                    <td class="value">${formatDate(appraisal.date_joined)}</td>
                </tr>
                <tr>
                    <td class="label">Review Period:</td>
                    <td class="value">${appraisal.review_period || 'N/A'}</td>
                    <td class="label">Evaluation Date:</td>
                    <td class="value">${formatDate(appraisal.reviewed_date)}</td>
                </tr>
                <tr>
                    <td class="label">Appraiser Name:</td>
                    <td class="value">${appraisal.appraiser_name || 'N/A'}</td>
                    <td class="label">Line Manager:</td>
                    <td class="value">${appraisal.manager || 'N/A'}</td>
                </tr>
            </table>
            
            <div class="section-heading">Part A: General HR Assessment</div>
            <table class="ratings-table">
                <thead>
                    <tr>
                        <th style="width: 70%;">Performance Attribute</th>
                        <th style="width: 30%; text-align: center;">Assessed Rating</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1. Attendance & Reliability</td>
                        <td style="text-align: center;">${formatRating(appraisal.attendance_rating)}</td>
                    </tr>
                    <tr>
                        <td>2. Punctuality</td>
                        <td style="text-align: center;">${formatRating(appraisal.punctuality_rating)}</td>
                    </tr>
                    <tr>
                        <td>3. Compliance & Policy Adherence</td>
                        <td style="text-align: center;">${formatRating(appraisal.compliance_rating)}</td>
                    </tr>
                    <tr>
                        <td>4. Employee Engagement</td>
                        <td style="text-align: center;">${formatRating(appraisal.engagement_rating)}</td>
                    </tr>
                    <tr>
                        <td>5. Job Qualification & Suitability</td>
                        <td style="text-align: center;">${formatRating(appraisal.qualification_rating)}</td>
                    </tr>
                </tbody>
            </table>
            
            ${appraisal.comments ? `
            <div class="narrative-block">
                <div class="narrative-title">HR Comments & Remarks:</div>
                <div class="narrative-content">${appraisal.comments}</div>
            </div>
            ` : ''}
            
            <div class="section-heading">Part B: Functional & Managerial Assessment</div>
            <table class="ratings-table">
                <thead>
                    <tr>
                        <th style="width: 70%;">Job Metric / Competency</th>
                        <th style="width: 30%; text-align: center;">Assessed Rating</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1. Job Knowledge & Skill Application</td>
                        <td style="text-align: center;">${formatRating(appraisal.job_knowledge_rating)}</td>
                    </tr>
                    <tr>
                        <td>2. Key Performance Indicators Achievement</td>
                        <td style="text-align: center;">${formatRating(appraisal.achieved_kpis_rating)}</td>
                    </tr>
                    <tr>
                        <td>3. Quality of Work Output</td>
                        <td style="text-align: center;">${formatRating(appraisal.work_quality_rating)}</td>
                    </tr>
                    <tr>
                        <td>4. Initiative & Problem Solving</td>
                        <td style="text-align: center;">${formatRating(appraisal.initiative_rating)}</td>
                    </tr>
                    <tr>
                        <td>5. Time Management & Execution</td>
                        <td style="text-align: center;">${formatRating(appraisal.time_management_rating)}</td>
                    </tr>
                    <tr>
                        <td>6. Accurate Record-keeping / Administration</td>
                        <td style="text-align: center;">${formatRating(appraisal.accurate_records_rating)}</td>
                    </tr>
                    <tr>
                        <td>7. Team Work & Synergy</td>
                        <td style="text-align: center;">${formatRating(appraisal.team_work_rating)}</td>
                    </tr>
                    <tr>
                        <td>8. Organizing & Planning Capabilities</td>
                        <td style="text-align: center;">${formatRating(appraisal.organizing_planning_rating)}</td>
                    </tr>
                    <tr>
                        <td>9. General Work Attitude & Dedication</td>
                        <td style="text-align: center;">${formatRating(appraisal.work_attitude_rating)}</td>
                    </tr>
                </tbody>
            </table>
            
            ${appraisal.kpis_for_this_year ? `
            <div class="narrative-block">
                <div class="narrative-title">Established KPIs for the Upcoming Review Period:</div>
                <div class="narrative-content">${appraisal.kpis_for_this_year}</div>
            </div>
            ` : ''}
            
            ${appraisal.employee_comments_problems ? `
            <div class="narrative-block">
                <div class="narrative-title">Employee Remarks, Professional Obstacles or Feedback:</div>
                <div class="narrative-content">${appraisal.employee_comments_problems}</div>
            </div>
            ` : ''}
            
            <div class="section-heading">Authorization & Endorsements</div>
            <p style="font-size: 9pt; font-style: italic; margin-bottom: 20px; color: #555;">
                By signing below, the parties acknowledge they have reviewed and agreed to the contents of this evaluation.
            </p>
            <table class="signatures-container">
                <tr>
                    <td>
                        <div class="signature-line">
                            Line Manager / Reviewer Signature
                        </div>
                    </td>
                    <td>
                        <div class="signature-line">
                            Employee Signature
                        </div>
                    </td>
                    <td>
                        <div class="signature-line">
                            HR Director Authorization / Date
                        </div>
                    </td>
                </tr>
            </table>
        </div>
    </body>
    </html>
    `;
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Trigger print
    printWindow.focus();
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 500);
};

export const exportProbationToPDF = async (probation) => {
    const printWindow = window.open('', '', 'height=800,width=1000');
    
    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const ratingLabels = {
        '4': '4 - Excellent / Exceeds Standards',
        '3': '3 - Good / Meets Standards',
        '2': '2 - Satisfactory / Basic Performance',
        '1': '1 - Poor / Unsatisfactory'
    };

    const formatRating = (rating) => {
        if (rating === undefined || rating === null || rating === "") return 'Not Evaluated';
        return ratingLabels[String(rating)] || rating;
    };

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Probation Assessment Report - ${probation.name}</title>
        <style>
            @media print {
                @page {
                    size: A4 portrait;
                    margin: 20mm;
                }
                body {
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
            }
            
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Times New Roman', Times, Georgia, serif;
                color: #111;
                background-color: #fff;
                line-height: 1.5;
                font-size: 11pt;
            }
            
            .report-container {
                max-width: 800px;
                margin: 0 auto;
                padding: 10px;
            }
            
            .company-header {
                text-align: center;
                margin-bottom: 25px;
                border-bottom: 2px double #333;
                padding-bottom: 15px;
            }
            
            .company-header h1 {
                font-size: 20pt;
                font-weight: bold;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 5px;
            }
            
            .company-header p {
                font-size: 10pt;
                font-style: italic;
                color: #555;
            }
            
            .document-title {
                text-align: center;
                font-size: 14pt;
                font-weight: bold;
                text-transform: uppercase;
                margin-bottom: 20px;
                letter-spacing: 0.5px;
                text-decoration: underline;
            }
            
            .meta-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 25px;
            }
            
            .meta-table td {
                border: 1px solid #333;
                padding: 8px 12px;
                font-size: 10pt;
                vertical-align: top;
            }
            
            .meta-table td.label {
                font-weight: bold;
                background-color: #f7f7f7;
                width: 25%;
            }
            
            .meta-table td.value {
                width: 25%;
            }
            
            .section-heading {
                font-size: 12pt;
                font-weight: bold;
                text-transform: uppercase;
                border-bottom: 1.5px solid #333;
                padding-bottom: 4px;
                margin: 25px 0 12px 0;
                page-break-after: avoid;
            }
            
            .ratings-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 15px;
            }
            
            .ratings-table th, .ratings-table td {
                border: 1px solid #333;
                padding: 8px 10px;
                font-size: 10pt;
                text-align: left;
            }
            
            .ratings-table th {
                background-color: #eee;
                font-weight: bold;
                text-transform: uppercase;
                font-size: 9pt;
            }
            
            .narrative-block {
                margin-bottom: 15px;
                page-break-inside: avoid;
            }
            
            .narrative-title {
                font-weight: bold;
                font-size: 10.5pt;
                margin-bottom: 5px;
            }
            
            .narrative-content {
                border: 1px solid #333;
                padding: 10px 12px;
                min-height: 100px;
                background-color: #fafafa;
                font-size: 10pt;
                white-space: pre-line;
            }
            
            .signatures-container {
                margin-top: 50px;
                width: 100%;
                border-collapse: collapse;
                page-break-inside: avoid;
            }
            
            .signatures-container td {
                width: 33%;
                padding: 0 15px;
                vertical-align: bottom;
                border: none;
            }
            
            .signature-line {
                border-top: 1px solid #333;
                margin-top: 45px;
                text-align: center;
                font-size: 9pt;
                padding-top: 5px;
            }
        </style>
    </head>
    <body>
        <div class="report-container">
            <div class="company-header">
                <h1>Emerald Isle Manpower</h1>
                <p>Human Resources Department — Employee Performance Management</p>
            </div>
            
            <div class="document-title">
                Employee Probationary Period Review
            </div>
            
            <table class="meta-table">
                <tr>
                    <td class="label">Employee Name:</td>
                    <td class="value">${probation.name}</td>
                    <td class="label">Employee ID:</td>
                    <td class="value">${probation.employee_id}</td>
                </tr>
                <tr>
                    <td class="label">Job Role/Position:</td>
                    <td class="value">${probation.role || 'N/A'}</td>
                    <td class="label">Department:</td>
                    <td class="value">${probation.department || 'N/A'}</td>
                </tr>
                <tr>
                    <td class="label">Date of Joining:</td>
                    <td class="value">${formatDate(probation.date_of_joining)}</td>
                    <td class="label">Review / Evaluation Date:</td>
                    <td class="value">${formatDate(probation.date_of_review)}</td>
                </tr>
                <tr>
                    <td class="label">Line Manager/Evaluator:</td>
                    <td class="value" colspan="3">${probation.department_head || 'N/A'}</td>
                </tr>
            </table>
            
            <div class="section-heading">Section A: Probationary Performance Metrics</div>
            <table class="ratings-table">
                <thead>
                    <tr>
                        <th style="width: 70%;">Performance Attributes</th>
                        <th style="width: 30%; text-align: center;">Evaluated Score</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1. Functional / Technical Skills</td>
                        <td style="text-align: center;">${formatRating(probation.functional_technical_skills)}</td>
                    </tr>
                    <tr>
                        <td>2. Results & Execution Orientation</td>
                        <td style="text-align: center;">${formatRating(probation.result_orientation)}</td>
                    </tr>
                    <tr>
                        <td>3. Creativity & Process Innovation</td>
                        <td style="text-align: center;">${formatRating(probation.creativity_innovation)}</td>
                    </tr>
                    <tr>
                        <td>4. Communication Skills (Written & Verbal)</td>
                        <td style="text-align: center;">${formatRating(probation.communication)}</td>
                    </tr>
                    <tr>
                        <td>5. Teamwork, Coordination & Synergy</td>
                        <td style="text-align: center;">${formatRating(probation.teamwork)}</td>
                    </tr>
                    <tr>
                        <td>6. Adaptability & Working Under Pressure</td>
                        <td style="text-align: center;">${formatRating(probation.adaptability)}</td>
                    </tr>
                    <tr>
                        <td>7. Supervisory & Managerial Potential</td>
                        <td style="text-align: center;">${formatRating(probation.supervisory_managerial)}</td>
                    </tr>
                </tbody>
            </table>
            
            ${probation.appraisers_comments ? `
            <div class="narrative-block">
                <div class="narrative-title">Evaluator Comments & Recommendations:</div>
                <div class="narrative-content">${probation.appraisers_comments}</div>
            </div>
            ` : ''}
            
            <div class="section-heading">Authorization & Signatures</div>
            <p style="font-size: 9pt; font-style: italic; margin-bottom: 20px; color: #555;">
                The signature of the employee indicates that they have read and discussed this probationary review, not necessarily that they concur with all scores.
            </p>
            <table class="signatures-container">
                <tr>
                    <td>
                        <div class="signature-line">
                            Department Head Signature / Date
                        </div>
                    </td>
                    <td>
                        <div class="signature-line">
                            Employee Signature / Date
                        </div>
                    </td>
                    <td>
                        <div class="signature-line">
                            HR Director Authorization / Date
                        </div>
                    </td>
                </tr>
            </table>
        </div>
    </body>
    </html>
    `;
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    printWindow.focus();
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 500);
};
