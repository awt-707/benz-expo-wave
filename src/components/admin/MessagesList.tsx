
import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Eye, MessageSquare, Trash, XCircle } from 'lucide-react';
import { contactApi } from '@/services/api';

interface Message {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
  responded: boolean;
}

const MessagesList = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        const data = await contactApi.getMessages();
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast({
          title: "Erreur",
          description: "Impossible de récupérer les messages",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [toast]);

  const handleViewMessage = (message: Message) => {
    setSelectedMessage(message);
    setDrawerOpen(true);
    
    // Mark as responded if it's not already
    if (!message.responded) {
      markAsResponded(message._id);
    }
  };

  const markAsResponded = async (id: string) => {
    try {
      await contactApi.markResponded(id);
      // Update local state
      setMessages(messages.map(msg => 
        msg._id === id ? { ...msg, responded: true } : msg
      ));
    } catch (error) {
      console.error('Error marking message as responded:', error);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce message ?")) {
      return;
    }

    try {
      await contactApi.deleteMessage(id);
      setMessages(messages.filter(msg => msg._id !== id));
      if (selectedMessage?._id === id) {
        setSelectedMessage(null);
        setDrawerOpen(false);
      }
      toast({
        title: "Suppression réussie",
        description: "Le message a été supprimé avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le message",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Messages</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <MessageSquare className="mr-2 h-4 w-4" />
            {messages.filter(m => !m.responded).length} non lus
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Demandes de contact</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Chargement...</div>
          ) : messages.length === 0 ? (
            <div className="text-center py-4">Aucun message</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((message) => (
                  <TableRow 
                    key={message._id}
                    className={!message.responded ? "bg-primary/5 font-medium" : ""}
                  >
                    <TableCell>
                      {!message.responded && (
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                      )}
                    </TableCell>
                    <TableCell>{message.name}</TableCell>
                    <TableCell>{message.email}</TableCell>
                    <TableCell>{message.phone}</TableCell>
                    <TableCell>
                      {format(new Date(message.createdAt), 'dd MMM yyyy HH:mm', { locale: fr })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleViewMessage(message)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteMessage(message._id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Message Drawer */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Message de {selectedMessage?.name}</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 py-2">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p>{selectedMessage?.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Téléphone</p>
                <p>{selectedMessage?.phone}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium text-muted-foreground">Date</p>
                <p>
                  {selectedMessage?.createdAt && 
                    format(new Date(selectedMessage.createdAt), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm font-medium text-muted-foreground">Message</p>
              <div className="mt-2 p-4 bg-muted rounded-md">
                <p className="whitespace-pre-line">{selectedMessage?.message}</p>
              </div>
            </div>
          </div>
          <DrawerFooter>
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setDrawerOpen(false)}
              >
                <XCircle className="mr-2 h-4 w-4" /> Fermer
              </Button>
              <Button 
                variant="destructive" 
                className="flex-1"
                onClick={() => selectedMessage && handleDeleteMessage(selectedMessage._id)}
              >
                <Trash className="mr-2 h-4 w-4" /> Supprimer
              </Button>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default MessagesList;
