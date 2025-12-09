import React from "react";

const ComprehensiveDataEntryForm = ({ formData, handleInputChange, handleSubmit, isSubmitting }) => {
  const inputStyle = {
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "14px",
    width: "100%",
  };

  const labelStyle = {
    fontWeight: 600,
    fontSize: "14px",
    color: "#333",
    marginBottom: "5px",
  };

  const sectionStyle = {
    marginBottom: "25px",
    paddingBottom: "20px",
    borderBottom: "2px solid #e0e0e0",
  };

  const sectionTitleStyle = {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#0b2f5a",
    marginBottom: "15px",
    paddingBottom: "8px",
    borderBottom: "2px solid #f7941e",
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        flex: 1,
        overflowY: "auto",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Personal Details Section */}
      <div style={sectionStyle}>
        <h4 style={sectionTitleStyle}>📋 Personal Details</h4>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px" }}>
          <div>
            <label style={labelStyle}>First Name <span style={{ color: "red" }}>*</span></label>
            <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="Enter first name (required)" required style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Middle Name</label>
            <input type="text" name="middleName" value={formData.middleName} onChange={handleInputChange} placeholder="Enter middle name or NA" style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Last Name <span style={{ color: "red" }}>*</span></label>
            <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Enter last name (required)" required style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Date of Birth</label>
            <input type="text" name="dob" value={formData.dob} onChange={handleInputChange} placeholder="DD/MM/YYYY or NA" style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Gender</label>
            <select name="gender" value={formData.gender} onChange={handleInputChange} style={inputStyle}>
              <option value="">Select or NA</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="NA">NA</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>Nationality</label>
            <input type="text" name="nationality" value={formData.nationality} onChange={handleInputChange} placeholder="Enter nationality or NA" style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Marital Status</label>
            <select name="maritalStatus" value={formData.maritalStatus} onChange={handleInputChange} style={inputStyle}>
              <option value="">Select or NA</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
              <option value="NA">NA</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>Passport Number</label>
            <input type="text" name="passport" value={formData.passport} onChange={handleInputChange} placeholder="Enter passport number or NA" style={inputStyle} />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Hobbies</label>
            <input type="text" name="hobbies" value={formData.hobbies} onChange={handleInputChange} placeholder="Enter hobbies (comma separated) or NA" style={inputStyle} />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Languages Known</label>
            <input type="text" name="languagesKnown" value={formData.languagesKnown} onChange={handleInputChange} placeholder="Enter languages (comma separated) or NA" style={inputStyle} />
          </div>
        </div>
      </div>

      {/* Address Section */}
      <div style={sectionStyle}>
        <h4 style={sectionTitleStyle}>📍 Address Details</h4>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px" }}>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Address</label>
            <textarea name="address" value={formData.address} onChange={handleInputChange} placeholder="Enter full address or NA" rows="2" style={{...inputStyle, resize: "vertical"}} />
          </div>

          <div>
            <label style={labelStyle}>Landmark</label>
            <input type="text" name="landmark" value={formData.landmark} onChange={handleInputChange} placeholder="Enter landmark or NA" style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>City</label>
            <input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="Enter city or NA" style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>State</label>
            <input type="text" name="state" value={formData.state} onChange={handleInputChange} placeholder="Enter state or NA" style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Pincode</label>
            <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} placeholder="Enter pincode or NA" style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Mobile <span style={{ color: "red" }}>*</span></label>
            <input type="tel" name="mobile" value={formData.mobile} onChange={handleInputChange} placeholder="Enter mobile number (required)" required style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Email <span style={{ color: "red" }}>*</span></label>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Enter email (required)" required style={inputStyle} />
          </div>
        </div>
      </div>

      {/* SSC Education */}
      <div style={sectionStyle}>
        <h4 style={sectionTitleStyle}>🎓 SSC Education</h4>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px" }}>
          <div>
            <label style={labelStyle}>SSC Result / Percentage</label>
            <input type="text" name="sscResult" value={formData.sscResult} onChange={handleInputChange} placeholder="Enter result or NA" style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>SSC Board / University</label>
            <input type="text" name="sscBoard" value={formData.sscBoard} onChange={handleInputChange} placeholder="Enter board name or NA" style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>SSC Passing Year</label>
            <input type="text" name="sscPassingYear" value={formData.sscPassingYear} onChange={handleInputChange} placeholder="Enter year or NA" style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>SSC Diploma (if any)</label>
            <input type="text" name="sscDiploma" value={formData.sscDiploma} onChange={handleInputChange} placeholder="Enter diploma or NA" style={inputStyle} />
          </div>
        </div>
      </div>

      {/* HSC Education */}
      <div style={sectionStyle}>
        <h4 style={sectionTitleStyle}>🎓 HSC Education</h4>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px" }}>
          <div>
            <label style={labelStyle}>HSC Result / Percentage</label>
            <input type="text" name="hscResult" value={formData.hscResult} onChange={handleInputChange} placeholder="Enter result or NA" style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>HSC Board / University</label>
            <input type="text" name="hscBoard" value={formData.hscBoard} onChange={handleInputChange} placeholder="Enter board name or NA" style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>HSC Passing Year</label>
            <input type="text" name="hscPassingYear" value={formData.hscPassingYear} onChange={handleInputChange} placeholder="Enter year or NA" style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>HSC Diploma (if any)</label>
            <input type="text" name="hscDiploma" value={formData.hscDiploma} onChange={handleInputChange} placeholder="Enter diploma or NA" style={inputStyle} />
          </div>
        </div>
      </div>

      {/* Graduation */}
      <div style={sectionStyle}>
        <h4 style={sectionTitleStyle}>🎓 Graduation</h4>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px" }}>
          <div>
            <label style={labelStyle}>Graduation Degree</label>
            <input type="text" name="graduationDegree" value={formData.graduationDegree} onChange={handleInputChange} placeholder="Enter degree or NA" style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Graduation Year</label>
            <input type="text" name="graduationYear" value={formData.graduationYear} onChange={handleInputChange} placeholder="Enter year or NA" style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Graduation Result / CGPA</label>
            <input type="text" name="graduationResult" value={formData.graduationResult} onChange={handleInputChange} placeholder="Enter result or NA" style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Graduation University</label>
            <input type="text" name="graduationUniversity" value={formData.graduationUniversity} onChange={handleInputChange} placeholder="Enter university or NA" style={inputStyle} />
          </div>
        </div>
      </div>

      {/* Post Graduation */}
      <div style={sectionStyle}>
        <h4 style={sectionTitleStyle}>🎓 Post Graduation</h4>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px" }}>
          <div>
            <label style={labelStyle}>Post Graduation Degree</label>
            <input type="text" name="postGraduationDegree" value={formData.postGraduationDegree} onChange={handleInputChange} placeholder="Enter degree or NA" style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Post Graduation Year</label>
            <input type="text" name="postGraduationYear" value={formData.postGraduationYear} onChange={handleInputChange} placeholder="Enter year or NA" style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Post Graduation Result / CGPA</label>
            <input type="text" name="postGraduationResult" value={formData.postGraduationResult} onChange={handleInputChange} placeholder="Enter result or NA" style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Post Graduation University</label>
            <input type="text" name="postGraduationUniversity" value={formData.postGraduationUniversity} onChange={handleInputChange} placeholder="Enter university or NA" style={inputStyle} />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Higher Level of Education</label>
            <input type="text" name="higherEducation" value={formData.higherEducation} onChange={handleInputChange} placeholder="PhD, Certifications, etc. or NA" style={inputStyle} />
          </div>
        </div>
      </div>

      {/* Employment Details */}
      <div style={sectionStyle}>
        <h4 style={sectionTitleStyle}>💼 Employment Details</h4>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px" }}>
          <div>
            <label style={labelStyle}>Total Experience (Years)</label>
            <input type="text" name="totalExperienceYears" value={formData.totalExperienceYears} onChange={handleInputChange} placeholder="Enter years or NA" style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Total Experience (Months)</label>
            <input type="text" name="totalExperienceMonths" value={formData.totalExperienceMonths} onChange={handleInputChange} placeholder="Enter months or NA" style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Total Companies Worked</label>
            <input type="text" name="totalCompaniesWorked" value={formData.totalCompaniesWorked} onChange={handleInputChange} placeholder="Enter number or NA" style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Last / Current Employer</label>
            <input type="text" name="lastCurrentEmployer" value={formData.lastCurrentEmployer} onChange={handleInputChange} placeholder="Enter company name or NA" style={inputStyle} />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "2px solid #e0e0e0" }}>
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: "100%",
            padding: "15px",
            backgroundColor: isSubmitting ? "#ccc" : "#0b2f5a",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: isSubmitting ? "not-allowed" : "pointer",
            transition: "background-color 0.3s",
          }}
        >
          {isSubmitting ? "Submitting..." : "✅ Submit & Next Resume"}
        </button>
      </div>
    </form>
  );
};

export default ComprehensiveDataEntryForm;
