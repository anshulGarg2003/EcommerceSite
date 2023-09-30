import { useState } from "react";
import { register } from "../redux/apiCall";
import { mobile } from "../responsive";
import { styled } from "styled-components";
import { useDispatch } from "react-redux";

const Container = styled.div`
  height: 100vh;
  ${mobile({ height: "70vh" })}
  width: 100vw;
  background: url("https://cdn.wallpapersafari.com/51/1/1T4NnK.jpg") center;
  background-size: cover;
  opacity: 0.6;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  padding: 40px;
  ${mobile({ padding: "20px", width: "55%" })}
  width: 50%;
  display: flex;
  margin: auto;
  flex-direction: column;
  background-color: rgb(250, 235, 215, 0.8);
  align-items: center;
  justify-content: center;
`;

const Title = styled.h1`
  margin-bottom: 20px;
  ${mobile({ marginBottom: "10px", fontSize: "15px" })}
`;
const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
`;
const Input = styled.input`
  padding: 5px;
  width: 40%;
  margin: 5px;
  font-size: 13px;
  ${mobile({ width: "37%", fontSize: "9px" })}
`;

const Agreement = styled.p`
  margin: 10px 0;
  font-size: 15px;
  ${mobile({ marginBottom: "10px", marginTop: "0px", fontSize: "10px" })}
`;
const Button = styled.button`
  padding: 10px;
  border-radius: 10px;
  font-weight: 400;
  border: 1px solid black;
  background-color: white;
  cursor: pointer;
  &:hover {
    font-weight: 600;
    background-color: #fad3a0;
  }
  ${mobile({ fontSize: "9px" })}
`;

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();

  const handleClick = (e) => {
    e.preventDefault();
    register(dispatch, { firstname, username, password, email });
  };
  return (
    <Container>
      <Wrapper>
        <Title>CREATE YOUR ACCOUNT</Title>
        <Form>
          <Input
            type="text"
            placeholder="FirstName..."
            onChange={(e) => setFirstname(e.target.value)}
          />
          <Input type="text" placeholder="LastName..." />
          <Input
            type="text"
            placeholder="UserName..."
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            type="email"
            placeholder="Type Email..."
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password..."
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input type="password" placeholder="Confirm Password..." />
        </Form>
        <Agreement>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Cupiditate
          nobis mollitia fuga velit libero sit maxime <b>PRIVACY POLICY</b>
          similique beatae?
        </Agreement>
        <Button onClick={handleClick}>CREATE ACCOUNT</Button>
      </Wrapper>
    </Container>
  );
};

export default Register;
