import React from 'react';

function ContactPage() {
  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">My Portfolio</h2>

      <div className="row">

        {/* Home Card */}
        <div className="col-md-4 mb-3">
          <div className="card h-100 text-center">
            <div className="card-body">
              <h5 className="card-title">Home</h5>
              <p className="card-text">
                Hi, I'm Sherva Badharudeen.
                I am an MCA student and aspiring developer.
              </p>
            </div>
          </div>
        </div>

        {/* About Card */}
        <div className="col-md-4 mb-3">
          <div className="card h-100 text-center">
            <div className="card-body">
              <h5 className="card-title">About</h5>
              <p className="card-text">
                I am interested in web development and software development.
                I enjoy learning new technologies and building applications.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Card */}
        <div className="col-md-4 mb-3">
          <div className="card h-100 text-center">
            <div className="card-body">
              <h5 className="card-title">Contact</h5>

              <p className="card-text">
                Email: shervabadharudeen2@gmail.com
              </p>

              <p className="card-text">
                Phone: 8891571208
              </p>

              <p className="card-text">
                LinkedIn:
                <a
                  href="https://www.linkedin.com/in/sherva-badharudeen/"
                  target="_blank"
                  rel="noreferrer"
                >
                  My LinkedIn
                </a>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ContactPage;