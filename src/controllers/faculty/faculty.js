import { getAllFaculty, getFacultyById, getSortedFaculty } from "../../models/faculty/faculty.js";

// Route handler for the faculty list page
export const facultyListPage = (req, res) => {
    const faculty = getAllFaculty();
    res.render('faculty-list', { title: 'Faculty List', faculty: faculty });
    
}

// Route handler for individual faculty detail pages
export const facultyDetailPage = (req, res) => {
    const facultyId = req.params.facultyId;
    const faculty = getFacultyById(facultyId);

    // If faculty doesn't exist, create 404 error
    if (!faculty) {
        const err = new Error(`Faculty ${facultyId} not found`);
        err.status = 404;
        return next(err);
    }

    // Handle sorting if requested
    const sortBy = req.query.sort || 'time';
    const sortedFaculty = getSortedFaculty(faculty.name, sortBy);

    res.render('faculty-detail', { 
        title: `${faculty.name}`, 
        faculty: { ...faculty, sections: sortedFaculty }, 
        currentSort: sortBy 
    });
}

