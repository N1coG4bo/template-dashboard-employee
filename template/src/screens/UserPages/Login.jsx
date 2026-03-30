import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import { loginApi } from '../../services/authApi';
import { isAuthenticated, setSession } from '../../services/authStorage';

export class Login extends Component {
  state = {
    email: 'admin@bakery.local',
    password: 'Admin123*',
    loading: false,
    error: '',
  };

  componentDidMount() {
    if (isAuthenticated()) {
      this.props.history.push('/dashboard');
    }
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    this.setState({ loading: true, error: '' });

    try {
      const response = await loginApi({
        email: this.state.email,
        password: this.state.password,
      });

      setSession(response.token, response.user);
      this.props.history.push('/dashboard');
    } catch (error) {
      this.setState({ error: 'Credenciales invalidas o backend no disponible.' });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    return (
      <div>
        <div className="d-flex align-items-center auth px-0">
          <div className="row w-100 mx-0">
            <div className="col-lg-4 mx-auto">
              <div className="auth-form-light text-left py-5 px-4 px-sm-5">
                <div className="brand-logo">
                  <img src={require("../../assets/images/logo.svg")} alt="logo" />
                </div>
                <h4>Hello! let's get started</h4>
                <h6 className="font-weight-light">Sign in to continue.</h6>
                <Form className="pt-3" onSubmit={this.handleSubmit}>
                  {this.state.error && (
                    <div className="alert alert-danger" role="alert">
                      {this.state.error}
                    </div>
                  )}
                  <Form.Group className="d-flex search-field">
                    <Form.Control
                      type="email"
                      placeholder="Email"
                      size="lg"
                      className="h-auto"
                      name="email"
                      value={this.state.email}
                      onChange={this.handleChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="d-flex search-field">
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      size="lg"
                      className="h-auto"
                      name="password"
                      value={this.state.password}
                      onChange={this.handleChange}
                      required
                    />
                  </Form.Group>
                  <div className="mt-3">
                    <button
                      className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"
                      type="submit"
                      disabled={this.state.loading}
                    >
                      {this.state.loading ? 'SIGNING IN...' : 'SIGN IN'}
                    </button>
                  </div>
                  <div className="my-2 d-flex justify-content-between align-items-center">
                    <div className="form-check">
                      <label className="form-check-label text-muted">
                        <input type="checkbox" className="form-check-input"/>
                        <i className="input-helper"></i>
                        Keep me signed in
                      </label>
                    </div>
                    <a href="!#" onClick={event => event.preventDefault()} className="auth-link text-black">Forgot password?</a>
                  </div>
                  <div className="mb-2">
                    <button type="button" className="btn btn-block btn-facebook auth-form-btn">
                      <i className="mdi mdi-facebook mr-2"></i>Connect using facebook
                    </button>
                  </div>
                  <div className="text-center mt-4 font-weight-light">
                    Don't have an account? <Link to="/user-pages/register" className="text-primary">Create</Link>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>  
      </div>
    )
  }
}

export default withRouter(Login)
