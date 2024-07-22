import { MessageContent } from "../types";
import { Alert } from '@mui/material';

type Prop = {
  message: MessageContent
}
const MessageAlert: React.FC<Prop> = ({message}: Prop) => {
  if (!message?.text){
    return null;
  }
  
  return (
    <>
    {message.level === 'error' && <Alert severity="error">{message.text}</Alert>}
    {message.level === 'success' && <Alert severity="success">{message.text}</Alert>}
    </>
  )
}

export default MessageAlert;
