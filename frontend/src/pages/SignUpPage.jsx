import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore';

const SignUpPage = () => {
    const [showPassoword, setshowPassoword] = useState(false);
    const [formData, setformData] = useState({
        username: "",
        email: "",
        password: ""
    });

    const {signup, isSigningUp} = useAuthStore();

    const validateForm = () => {};
    
    const handleSubmit = (e) => {
        e.preventDefault();
    };

  return (
    <div>
      SignUp Page
    </div>
  )
}

export default SignUpPage;
