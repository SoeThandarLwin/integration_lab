import { Box, Button, Card, Modal, TextField } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useKeyDown } from '../../../hooks/useKeyDown';
import CommentCard from './components/CommentCard';
import Axios from '../../AxiosInstance';
import Cookies from 'js-cookie';

const CommentModal = ({ open = false, handleClose = () => {} }) => {
  const [textField, setTextField] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const userToken = Cookies.get('UserToken');

    if (userToken == null || userToken == 'undefined') return;

    Axios.get('/comment', { headers: { Authorization: `Bearer ${userToken}` } })
      .then(res => {
        const transformed = res.data.data.map(x => {
          const msg = x.text;
          return {...x, msg };
        });

        setComments(transformed);
      })
  }, []);

  useKeyDown(() => {
    handleAddComment();
  }, ['Enter']);

  const handleAddComment = async () => {
    // TODO implement logic
    const userToken = Cookies.get('UserToken');

    if (userToken == null || userToken == 'undefined') return;

    const response = await Axios.post('/comment', {
      text: textField,
    }, {
      headers: {Authorization: `Bearer ${userToken}`}
    });

    if (response.data.success) {
      setComments([...comments, { id: Math.random(), msg: textField }]);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Card
        sx={{
          width: { xs: '60vw', lg: '40vw' },
          maxWidth: '600px',
          maxHeight: '400px',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          borderRadius: '16px',
          backgroundColor: '#ffffffCC',
          p: '2rem',
        }}
      >
        <Box
          sx={{
            display: 'flex',
          }}
        >
          <TextField
            value={textField}
            onChange={(e) => setTextField(e.target.value)}
            fullWidth
            placeholder="Type your comment"
            variant="standard"
          />
          <Button onClick={handleAddComment}>Submit</Button>
        </Box>
        <Box
          sx={{
            overflowY: 'scroll',
            maxHeight: 'calc(400px - 2rem)',
            '&::-webkit-scrollbar': {
              width: '.5rem', // chromium and safari
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#999999',
              borderRadius: '10px',
            },
          }}
        >
          {comments.map((comment) => (
            <CommentCard comment={comment} key={comment.id} />
          ))}
        </Box>
      </Card>
    </Modal>
  );
};

export default CommentModal;
