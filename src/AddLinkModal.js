import { Box, Button, Dialog, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@material-ui/core";
import React, { useState } from 'react';

import { SERVER_URL } from "./common";

function AddLinkModal(props) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
  };

  return (
    <div>
      <Button onClick={handleClickOpen}>
        Add a chat...
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <Box m={2}>
          <AddLinkForm {...props} />
        </Box>
      </Dialog>
    </div>
  )
}

class AddLinkForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: '',
      name: '',
      extra: '',
      link: '',
      listing: '',
      submitLabel: ''
    }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  async handleSubmit(event) {
    if (event) {
      event.preventDefault();
    }

    console.log("Submitting...")
    await fetch(`${SERVER_URL}/add`, {
      method: "POST",
      headers: {
        'Bypass-Tunnel-Reminder': 1,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        code: this.state.code,
        name: this.state.name,
        extra: this.state.extra,
        link: this.state.link,
        listing: this.state.listing
      })
    }).then(response => {
      if (!response.ok) {
        return response.json().then(body => {
          console.log(body);
          throw new Error(body.error || '');
        });
      }
    })
      .then(this.setState({ submitLabel: "Success!" }))
      .catch((e) => {
        console.error("Error in submitting course: " + e);
        this.setState({ submitLabel: `Error adding course. (${e})` })
        return
      });
  }

  inputProps = {
    style: {
      margin: "30px",
      width: "400px"
    }
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit} id="addlinkform">
          <Typography>
            Add a chat for a course. Copy the course code and name from WebSTAC.
          </Typography>
          <div class="addlinkrow">
            <TextField
              required
              label="Course Code"
              placeholder="L07 Chem 261"
              name="code"
              type="text"
              value={this.state.code}
              onChange={this.handleInputChange}
            />
          </div>
          <div class="addlinkrow">
            <TextField
              required
              label="Course Name"
              placeholder="Organic Chemistry"
              name="name"
              type="text"
              value={this.state.name}
              onChange={this.handleInputChange}
            />
          </div>
          <div class="addlinkrow">
            <TextField
              label="Additional Info (optional)"
              placeholder="Lab"
              name="extra"
              type="text"
              value={this.state.extra}
              onChange={this.handleInputChange}
            />
          </div>
          <div class="addlinkrow">
            <TextField
              required
              label="Link"
              placeholder="https://groupme.com/join_group/..."
              name="link"
              type="text"
              value={this.state.link}
              onChange={this.handleInputChange}
            />
          </div>
          <div class="addlinkrow">
            <FormControl variant="standard">
              <InputLabel id="select-listing-label">Choose Listing</InputLabel>
              <Select
                required
                labelId="select-listing-label"
                name="listing"
                value={this.state.listing}
                onChange={this.handleInputChange}
              >
                {this.props.listings.map((data, index) => <MenuItem key={index} value={data.name}>{data.name}</MenuItem>)}
              </Select>
            </FormControl>
          </div>
          <Button type="submit">Add Chat</Button>
          <Typography>{this.state.submitLabel}</Typography>
        </form>
      </div>
    );
  }
}

export default AddLinkModal;