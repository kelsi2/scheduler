import React, { useState } from "react";
import InterviewerList from "../InterviewerList";
import Button from "../Button";

export default function Form(props) {
  const [name, setName] = useState(props.name || "");
  const [interviewer, setInterviewer] = useState([props.interviewer] || null);

  //reset interview form
  const reset = (event) => {
    setName("");
    setInterviewer(null);
  };
  //cancel interview form
  const cancel = () => {
    reset();
    props.onCancel();
  };
  //save interview form
  const save = () => {
    props.onSave(name, interviewer);
  };

  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off" onSubmit={(event) => event.preventDefault()}>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="appointment__create-input text--semi-bold"
            name="name"
            type="text"
            placeholder="Enter Student Name"
          />
        </form>
        <InterviewerList
          interviewers={props.interviewers}
          interviewer={interviewer}
          onChange={setInterviewer}
        />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button
            danger
            onClick={() => {
              cancel();
            }}
          >
            Cancel
          </Button>
          <Button
            confirm
            onClick={() => {
              save();
            }}
          >
            Save
          </Button>
        </section>
      </section>
    </main>
  );
}
