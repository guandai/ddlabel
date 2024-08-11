import { MessageContent } from "../../types";
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
      <Alert severity={message.level}>{message.text}</Alert>
    </>
  )
}

export default MessageAlert;
